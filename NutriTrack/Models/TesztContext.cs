using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace NutriTrack.Models;

public partial class TesztContext : DbContext
{
    public TesztContext()
    {
    }

    public TesztContext(DbContextOptions<TesztContext> options)
        : base(options)
    {
    }

    public virtual DbSet<FoodCategory> FoodCategories { get; set; }

    public virtual DbSet<FoodItem> FoodItems { get; set; }

    public virtual DbSet<Meal> Meals { get; set; }

    public virtual DbSet<MealFoodItem> MealFoodItems { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserSetting> UserSettings { get; set; }

    public virtual DbSet<WaterIntakeLog> WaterIntakeLogs { get; set; }

    public virtual DbSet<WeightGoal> WeightGoals { get; set; }

    public virtual DbSet<WeightLog> WeightLogs { get; set; }


    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<FoodCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PRIMARY");

            entity.ToTable("food_categories");

            entity.HasIndex(e => e.CategoryName, "category_name").IsUnique();

            entity.Property(e => e.CategoryId)
                .HasColumnType("int(11)")
                .HasColumnName("category_id");
            entity.Property(e => e.CategoryName)
                .HasMaxLength(64)
                .HasColumnName("category_name");
            entity.Property(e => e.Description)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("text")
                .HasColumnName("description");
        });

        modelBuilder.Entity<FoodItem>(entity =>
        {
            entity.HasKey(e => e.FoodId).HasName("PRIMARY");

            entity.ToTable("food_items");

            entity.HasIndex(e => e.CategoryId, "idx_food_category");

            entity.Property(e => e.FoodId)
                .HasColumnType("int(11)")
                .HasColumnName("food_id");
            entity.Property(e => e.CaloriesPer100g)
                .HasColumnType("int(11)")
                .HasColumnName("calories_per_100g");
            entity.Property(e => e.CarbsPer100g)
                .HasPrecision(5)
                .HasColumnName("carbs_per_100g");
            entity.Property(e => e.CategoryId)
                .HasColumnType("int(11)")
                .HasColumnName("category_id");
            entity.Property(e => e.FatPer100g)
                .HasPrecision(5)
                .HasColumnName("fat_per_100g");
            entity.Property(e => e.Name)
                .HasMaxLength(128)
                .HasColumnName("name");
            entity.Property(e => e.ProteinPer100g)
                .HasPrecision(5)
                .HasColumnName("protein_per_100g");

            entity.HasOne(d => d.Category).WithMany(p => p.FoodItems)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("food_items_ibfk_1");
        });

        modelBuilder.Entity<Meal>(entity =>
        {
            entity.HasKey(e => e.MealId).HasName("PRIMARY");

            entity.ToTable("meals");

            entity.HasIndex(e => e.MealType, "idx_meal_type");

            entity.HasIndex(e => new { e.UserId, e.MealDate }, "idx_user_meals");

            entity.HasIndex(e => new { e.UserId, e.MealDate, e.MealType }, "unique_meal_per_day").IsUnique();

            entity.Property(e => e.MealId)
                .HasColumnType("int(11)")
                .HasColumnName("meal_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("created_at");
            entity.Property(e => e.MealDate)
                .HasColumnType("date")
                .HasColumnName("meal_date");
            entity.Property(e => e.MealType)
                .HasColumnType("enum('Breakfast','Lunch','Dinner','Supper','Snack')")
                .HasColumnName("meal_type");
            entity.Property(e => e.UserId)
                .HasColumnType("int(11)")
                .HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Meals)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("meals_ibfk_1");
        });

        modelBuilder.Entity<MealFoodItem>(entity =>
        {
            entity.HasKey(e => new { e.MealId, e.FoodId }).HasName("PRIMARY");

            entity.ToTable("meal_food_items");

            entity.HasIndex(e => e.FoodId, "food_id");

            entity.Property(e => e.MealId)
                .HasColumnType("int(11)")
                .HasColumnName("meal_id");
            entity.Property(e => e.FoodId)
                .HasColumnType("int(11)")
                .HasColumnName("food_id");
            entity.Property(e => e.AddedAt)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("datetime")
                .HasColumnName("added_at");
            entity.Property(e => e.QuantityGrams)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("int(11)")
                .HasColumnName("quantity_grams");

            entity.HasOne(d => d.Food).WithMany(p => p.MealFoodItems)
                .HasForeignKey(d => d.FoodId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("meal_food_items_ibfk_2");

            entity.HasOne(d => d.Meal).WithMany(p => p.MealFoodItems)
                .HasForeignKey(d => d.MealId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("meal_food_items_ibfk_1");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PRIMARY");

            entity.ToTable("users");

            entity.HasIndex(e => e.Email, "email").IsUnique();

            entity.HasIndex(e => e.Username, "username").IsUnique();

            entity.Property(e => e.UserId)
                .HasColumnType("int(11)")
                .HasColumnName("user_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("created_at");
            entity.Property(e => e.Email)
                .HasMaxLength(128)
                .HasColumnName("email");
            entity.Property(e => e.HeightCm)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("int(11)")
                .HasColumnName("height_cm");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .HasColumnName("password_hash");
            entity.Property(e => e.Username)
                .HasMaxLength(32)
                .HasColumnName("username");
            entity.Property(e => e.WeightKg)
                .HasPrecision(5)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("weight_kg");
        });

        modelBuilder.Entity<UserSetting>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PRIMARY");

            entity.ToTable("user_settings");

            entity.Property(e => e.UserId)
                .HasColumnType("int(11)")
                .HasColumnName("user_id");
            entity.Property(e => e.DailyCalorieGoal)
                .HasDefaultValueSql("'2000'")
                .HasColumnType("int(11)")
                .HasColumnName("daily_calorie_goal");
            entity.Property(e => e.DailyWaterGoalMl)
                .HasDefaultValueSql("'2500'")
                .HasColumnType("int(11)")
                .HasColumnName("daily_water_goal_ml");
            entity.Property(e => e.PreferredTimezone)
                .HasMaxLength(32)
                .HasDefaultValueSql("'''UTC'''")
                .HasColumnName("preferred_timezone");
            entity.Property(e => e.UpdatedAt)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("updated_at");

            entity.HasOne(d => d.User).WithOne(p => p.UserSetting)
                .HasForeignKey<UserSetting>(d => d.UserId)
                .HasConstraintName("user_settings_ibfk_1");
        });

        modelBuilder.Entity<WaterIntakeLog>(entity =>
        {
            entity.HasKey(e => e.EntryId).HasName("PRIMARY");

            entity.ToTable("water_intake_log");

            entity.HasIndex(e => new { e.UserId, e.EntryDate }, "idx_water_user_date");

            entity.Property(e => e.EntryId)
                .HasColumnType("int(11)")
                .HasColumnName("entry_id");
            entity.Property(e => e.AmountMl)
                .HasColumnType("int(11)")
                .HasColumnName("amount_ml");
            entity.Property(e => e.EntryDate)
                .HasColumnType("date")
                .HasColumnName("entry_date");
            entity.Property(e => e.LoggedAt)
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("logged_at");
            entity.Property(e => e.UserId)
                .HasColumnType("int(11)")
                .HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.WaterIntakeLogs)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("water_intake_log_ibfk_1");
        });

        modelBuilder.Entity<WeightGoal>(entity =>
        {
            entity.HasKey(e => e.GoalId).HasName("PRIMARY");

            entity.ToTable("weight_goals");

            entity.HasIndex(e => e.UserId, "idx_user_goals");

            entity.Property(e => e.GoalId)
                .HasColumnType("int(11)")
                .HasColumnName("goal_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("created_at");
            entity.Property(e => e.EndDate)
                .HasColumnType("date")
                .HasColumnName("end_date");
            entity.Property(e => e.StartDate)
                .HasColumnType("date")
                .HasColumnName("start_date");
            entity.Property(e => e.TargetWeight)
                .HasPrecision(5)
                .HasColumnName("target_weight");
            entity.Property(e => e.UserId)
                .HasColumnType("int(11)")
                .HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.WeightGoals)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("weight_goals_ibfk_1");
        });

        modelBuilder.Entity<WeightLog>(entity =>
        {
            entity.HasKey(e => e.WeightEntryId).HasName("PRIMARY");

            entity.ToTable("weight_log");

            entity.HasIndex(e => new { e.UserId, e.MeasurementDate }, "idx_user_weight");

            entity.HasIndex(e => new { e.UserId, e.MeasurementDate }, "unique_weight_per_day").IsUnique();

            entity.Property(e => e.WeightEntryId)
                .HasColumnType("int(11)")
                .HasColumnName("weight_entry_id");
            entity.Property(e => e.MeasuredAt)
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("measured_at");
            entity.Property(e => e.MeasurementDate)
                .HasColumnType("date")
                .HasColumnName("measurement_date");
            entity.Property(e => e.UserId)
                .HasColumnType("int(11)")
                .HasColumnName("user_id");
            entity.Property(e => e.WeightKg)
                .HasPrecision(5)
                .HasColumnName("weight_kg");

            entity.HasOne(d => d.User).WithMany(p => p.WeightLogs)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("weight_log_ibfk_1");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
