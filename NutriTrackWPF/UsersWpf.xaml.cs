using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using NutriTrack.Models;
using NutriTrack.Helpers;

namespace NutriTrackWPF
{
    public partial class UsersWpf : Page
    {
        public UsersWpf()
        {
            InitializeComponent();
            LoadData();
        }

        public void LoadData()
        {
            using (var context = new TesztContext())
            {
                UsersGrid.ItemsSource = context.Users.ToList();
            }
        }

        private void BtnAddUser_Click(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrWhiteSpace(txtUsername.Text) || string.IsNullOrWhiteSpace(txtEmail.Text))
            {
                MessageBox.Show("Please fill in the username and email fields!", "Warning", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            try
            {
                using (var context = new TesztContext())
                {
                    var newUser = new User
                    {
                        Username = txtUsername.Text,
                        Email = txtEmail.Text,
                        PasswordHash = PasswordHasher.HashPassword(txtPassword.Password),
                        Privilege = 1
                    };

                    context.Users.Add(newUser);
                    context.SaveChanges();
                }

                LoadData();

                MessageBox.Show("User successfully added!", "Success", MessageBoxButton.OK, MessageBoxImage.Information);

                txtUsername.Clear();
                txtEmail.Clear();
                txtPassword.Clear();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"An error occurred while saving: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void BtnDeleteUser_Click(object sender, RoutedEventArgs e)
        {
            var selectedUser = UsersGrid.SelectedItem as User;

            if (selectedUser == null)
            {
                MessageBox.Show("Please select a user from the table to delete!", "Warning", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            MessageBoxResult result = MessageBox.Show($"Are you sure you want to delete the following user: {selectedUser.Username}?",
                "Confirm Deletion", MessageBoxButton.YesNo, MessageBoxImage.Question);

            if (result == MessageBoxResult.Yes)
            {
                try
                {
                    using (var context = new TesztContext())
                    {
                        context.Users.Attach(selectedUser);
                        context.Users.Remove(selectedUser);
                        context.SaveChanges();
                    }

                    LoadData();

                    MessageBox.Show("User successfully deleted!", "Success", MessageBoxButton.OK, MessageBoxImage.Information);
                }
                catch (Exception ex)
                {
                    MessageBox.Show($"An error occurred during deletion: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
        }
    }
}