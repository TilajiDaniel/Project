using NutriTrack.Models;
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

namespace NutriTrackWPF
{
    public partial class FoodsWpf : Page
    {
        public FoodsWpf()
        {
            InitializeComponent();
            LoadData();
        }

        public void LoadData()
        {
            using (var context = new TesztContext())
            {
                FoodsGrid.ItemsSource = context.FoodItems.ToList();
            }
        }

        private void BtnAddFood_Click(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrWhiteSpace(txtFoodName.Text))
            {
                MessageBox.Show("Please enter the food name!", "Warning", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            if (!int.TryParse(txtCategoryId.Text, out int categoryId) ||
                !int.TryParse(txtCalories.Text, out int calories) ||
                !decimal.TryParse(txtProtein.Text, out decimal protein) ||
                !decimal.TryParse(txtCarbs.Text, out decimal carbs) ||
                !decimal.TryParse(txtFat.Text, out decimal fat))
            {
                MessageBox.Show("Category ID and Calories must be whole numbers! Please enter valid numbers for macros!", "Format Error", MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }

            try
            {
                using (var context = new TesztContext())
                {
                    var newFoodItem = new FoodItem
                    {
                        Name = txtFoodName.Text,
                        CategoryId = categoryId,
                        CaloriesPer100g = calories,
                        ProteinPer100g = protein,
                        CarbsPer100g = carbs,
                        FatPer100g = fat
                    };

                    context.FoodItems.Add(newFoodItem);
                    context.SaveChanges();
                }

                LoadData();

                MessageBox.Show("Food successfully added!", "Success", MessageBoxButton.OK, MessageBoxImage.Information);

                txtFoodName.Clear();
                txtCategoryId.Clear();
                txtCalories.Clear();
                txtProtein.Clear();
                txtCarbs.Clear();
                txtFat.Clear();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"An error occurred while saving: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void BtnDeleteFood_Click(object sender, RoutedEventArgs e)
        {
            var selectedFood = FoodsGrid.SelectedItem as FoodItem;

            if (selectedFood == null)
            {
                MessageBox.Show("Please select a food from the table to delete!", "Warning", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            MessageBoxResult result = MessageBox.Show($"Are you sure you want to delete the following food: {selectedFood.Name}?",
                "Confirm Deletion", MessageBoxButton.YesNo, MessageBoxImage.Question);

            if (result == MessageBoxResult.Yes)
            {
                try
                {
                    using (var context = new TesztContext())
                    {
                        context.FoodItems.Attach(selectedFood);
                        context.FoodItems.Remove(selectedFood);
                        context.SaveChanges();
                    }

                    LoadData();

                    MessageBox.Show("Food successfully deleted!", "Success", MessageBoxButton.OK, MessageBoxImage.Information);
                }
                catch (Exception ex)
                {
                    MessageBox.Show($"An error occurred during deletion: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
        }
    }
}