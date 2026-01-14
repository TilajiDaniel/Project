using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace NutritrackAPI.Models;

public partial class NutritrackContext : DbContext
{
    public NutritrackContext()
    {
    }

    public NutritrackContext(DbContextOptions<NutritrackContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<FoodItem> FoodItems { get; set; }

    public virtual DbSet<Goal> Goals { get; set; }

    public virtual DbSet<Meal> Meals { get; set; }

    public virtual DbSet<MealFood> MealFoods { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<WaterIntake> WaterIntakes { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySQL("SERVER=localhost;PORT=3306;DATABASE=nutritrack;USER=root;PASSWORD=;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PRIMARY");

            entity.ToTable("categories");

            entity.Property(e => e.CategoryId)
                .HasColumnType("int(11)")
                .HasColumnName("category_id");
            entity.Property(e => e.CategoryName)
                .HasMaxLength(32)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("category_name");
        });

        modelBuilder.Entity<FoodItem>(entity =>
        {
            entity.HasKey(e => e.FoodId).HasName("PRIMARY");

            entity.ToTable("food_items");

            entity.HasIndex(e => e.CategoryId, "category_id");

            entity.Property(e => e.FoodId)
                .HasColumnType("int(11)")
                .HasColumnName("food_id");
            entity.Property(e => e.CaloriesPer100g)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("int(11)")
                .HasColumnName("calories_per_100g");
            entity.Property(e => e.CarbsPer100g)
                .HasPrecision(5)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("carbs_per_100g");
            entity.Property(e => e.CategoryId)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("int(11)")
                .HasColumnName("category_id");
            entity.Property(e => e.FatPer100g)
                .HasPrecision(5)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("fat_per_100g");
            entity.Property(e => e.Name)
                .HasMaxLength(32)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("name");
            entity.Property(e => e.ProteinPer100g)
                .HasPrecision(5)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("protein_per_100g");

            entity.HasOne(d => d.Category).WithMany(p => p.FoodItems)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("food_items_ibfk_1");
        });

        modelBuilder.Entity<Goal>(entity =>
        {
            entity.HasKey(e => e.GoalId).HasName("PRIMARY");

            entity.ToTable("goals");

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.GoalId)
                .HasColumnType("int(11)")
                .HasColumnName("goal_id");
            entity.Property(e => e.EndDate)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("datetime")
                .HasColumnName("end_date");
            entity.Property(e => e.StartDate)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("datetime")
                .HasColumnName("start_date");
            entity.Property(e => e.TargetWeight)
                .HasPrecision(4, 1)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("target_weight");
            entity.Property(e => e.UserId)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("int(11)")
                .HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Goals)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("goals_ibfk_1");
        });

        modelBuilder.Entity<Meal>(entity =>
        {
            entity.HasKey(e => e.MealId).HasName("PRIMARY");

            entity.ToTable("meals");

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.MealId)
                .HasColumnType("int(11)")
                .HasColumnName("meal_id");
            entity.Property(e => e.Date)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("datetime")
                .HasColumnName("date_");
            entity.Property(e => e.MealType)
                .HasMaxLength(16)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("meal_type");
            entity.Property(e => e.UserId)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("int(11)")
                .HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Meals)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("meals_ibfk_1");
        });

        modelBuilder.Entity<MealFood>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("meal_foods");

            entity.HasIndex(e => e.FoodId, "food_id");

            entity.HasIndex(e => e.MealId, "meal_id");

            entity.Property(e => e.FoodId)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("int(11)")
                .HasColumnName("food_id");
            entity.Property(e => e.MealId)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("int(11)")
                .HasColumnName("meal_id");
            entity.Property(e => e.QuantityGrams)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("int(11)")
                .HasColumnName("quantity_grams");

            entity.HasOne(d => d.Food).WithMany()
                .HasForeignKey(d => d.FoodId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("meal_foods_ibfk_2");

            entity.HasOne(d => d.Meal).WithMany()
                .HasForeignKey(d => d.MealId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("meal_foods_ibfk_1");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PRIMARY");

            entity.ToTable("users");

            entity.Property(e => e.UserId)
                .HasColumnType("int(11)")
                .HasColumnName("user_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Email)
                .HasMaxLength(64)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("email");
            entity.Property(e => e.HeightCm)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("int(11)")
                .HasColumnName("height_cm");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(64)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("password_hash");
            entity.Property(e => e.Username)
                .HasMaxLength(16)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("username");
            entity.Property(e => e.WeightKg)
                .HasPrecision(4, 1)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("weight_kg");
        });

        modelBuilder.Entity<WaterIntake>(entity =>
        {
            entity.HasKey(e => e.EntryId).HasName("PRIMARY");

            entity.ToTable("water_intake");

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.EntryId)
                .HasColumnType("int(11)")
                .HasColumnName("entry_id");
            entity.Property(e => e.AmountMl)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("int(11)")
                .HasColumnName("amount_ml");
            entity.Property(e => e.Date)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("datetime")
                .HasColumnName("date_");
            entity.Property(e => e.UserId)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("int(11)")
                .HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.WaterIntakes)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("water_intake_ibfk_1");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
