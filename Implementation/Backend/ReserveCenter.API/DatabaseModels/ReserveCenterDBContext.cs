
#nullable disable
using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace ReserveCenter.API.DatabaseModels;

public partial class ReserveCenterDBContext : DbContext
{
    public ReserveCenterDBContext(DbContextOptions<ReserveCenterDBContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Advertisement> Advertisements { get; set; }

    public virtual DbSet<Appointment> Appointments { get; set; }

    public virtual DbSet<AppointmentStatus> AppointmentStatuses { get; set; }

    public virtual DbSet<City> Cities { get; set; }

    public virtual DbSet<Org> Orgs { get; set; }

    public virtual DbSet<Orgservice> Orgservices { get; set; }

    public virtual DbSet<Orgtype> Orgtypes { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<StaffList> StaffLists { get; set; }

    public virtual DbSet<UnregisteredOrg> UnregisteredOrgs { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Advertisement>(entity =>
        {
            entity.ToTable("Advertisements", "org");

            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.Description)
                .IsRequired()
                .HasMaxLength(120);
            entity.Property(e => e.Image)
                .IsRequired()
                .HasMaxLength(256);
            entity.Property(e => e.ModifiedDate).HasColumnType("datetime");
            entity.Property(e => e.OrgId).HasColumnName("ORGId");
            entity.Property(e => e.Title)
                .IsRequired()
                .HasMaxLength(256);

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.Advertisements)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Advertisements_Users");

            entity.HasOne(d => d.Org).WithMany(p => p.Advertisements)
                .HasForeignKey(d => d.OrgId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Advertisements_Organizations");
        });

        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.ToTable("Appointments", "org");

            entity.Property(e => e.BookingConfirmCode).HasMaxLength(256);
            entity.Property(e => e.OrgId).HasColumnName("ORGId");
            entity.Property(e => e.OrgserviceId).HasColumnName("ORGServiceId");

            entity.HasOne(d => d.AppointmentStatus).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.AppointmentStatusId)
                .HasConstraintName("FK_Appointments_AppointmentStatuses");

            entity.HasOne(d => d.BookingUser).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.BookingUserId)
                .HasConstraintName("FK_Appointments_Users");

            entity.HasOne(d => d.Org).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.OrgId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Appointments_Organizations");

            entity.HasOne(d => d.Orgservice).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.OrgserviceId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Appointments_OrganizationServices");
        });

        modelBuilder.Entity<AppointmentStatus>(entity =>
        {
            entity.ToTable("AppointmentStatuses", "org");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Status)
                .IsRequired()
                .HasMaxLength(256);
        });

        modelBuilder.Entity<City>(entity =>
        {
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(256);
        });

        modelBuilder.Entity<Org>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_Organizations");

            entity.ToTable("ORGs", "org");

            entity.Property(e => e.ActiveDaysPerWeek)
                .IsRequired()
                .HasMaxLength(256);
            entity.Property(e => e.Address)
                .IsRequired()
                .HasMaxLength(256);
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.Description)
                .IsRequired()
                .HasMaxLength(500);
            entity.Property(e => e.Image)
                .IsRequired()
                .HasMaxLength(256);
            entity.Property(e => e.ModifiedDate).HasColumnType("datetime");
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(256);
            entity.Property(e => e.OrgtypeId).HasColumnName("ORGTypeId");
            entity.Property(e => e.StarCount).HasColumnType("decimal(1, 1)");

            entity.HasOne(d => d.City).WithMany(p => p.Orgs)
                .HasForeignKey(d => d.CityId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Organizations_Cities");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.Orgs)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Organizations_Users");

            entity.HasOne(d => d.Orgtype).WithMany(p => p.Orgs)
                .HasForeignKey(d => d.OrgtypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Organizations_OrganizationTypes");
        });

        modelBuilder.Entity<Orgservice>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_OrganizationServices");

            entity.ToTable("ORGServices", "org");

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(256);
            entity.Property(e => e.OrgId).HasColumnName("ORGId");
        });

        modelBuilder.Entity<Orgtype>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_OrganizationTypes");

            entity.ToTable("ORGTypes", "org");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(256);
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.ToTable("Roles", "identity");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(256);
        });

        modelBuilder.Entity<StaffList>(entity =>
        {
            entity.ToTable("StaffLists", "identity");

            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.ModifiedDate).HasColumnType("datetime");
            entity.Property(e => e.OrgId).HasColumnName("ORGId");

            entity.HasOne(d => d.Org).WithMany(p => p.StaffLists)
                .HasForeignKey(d => d.OrgId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_StaffLists_Organizations");

            entity.HasOne(d => d.Role).WithMany(p => p.StaffLists)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_StaffLists_Roles");

            entity.HasOne(d => d.User).WithMany(p => p.StaffLists)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_StaffLists_Users");
        });

        modelBuilder.Entity<UnregisteredOrg>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_OrganizationWatingForApproval");

            entity.ToTable("UnregisteredORGs", "org");

            entity.Property(e => e.ActiveDaysPerWeek)
                .IsRequired()
                .HasMaxLength(256);
            entity.Property(e => e.Address)
                .IsRequired()
                .HasMaxLength(256);
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.Description)
                .IsRequired()
                .HasMaxLength(256);
            entity.Property(e => e.Image)
                .IsRequired()
                .HasMaxLength(256);
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(256);
            entity.Property(e => e.OrgtypeId).HasColumnName("ORGTypeId");

            entity.HasOne(d => d.City).WithMany(p => p.UnregisteredOrgs)
                .HasForeignKey(d => d.CityId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_OrganizationWatingForApproval_Cities");

            entity.HasOne(d => d.Orgtype).WithMany(p => p.UnregisteredOrgs)
                .HasForeignKey(d => d.OrgtypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_OrganizationWatingForApproval_OrganizationTypes");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users", "identity");

            entity.Property(e => e.ChangePasswordDateTime).HasColumnType("datetime");
            entity.Property(e => e.FirstName)
                .IsRequired()
                .HasMaxLength(256);
            entity.Property(e => e.LastName)
                .IsRequired()
                .HasMaxLength(256);
            entity.Property(e => e.LastPassword).HasMaxLength(256);
            entity.Property(e => e.ModifiedDate).HasColumnType("datetime");
            entity.Property(e => e.NationalCode).HasMaxLength(256);
            entity.Property(e => e.NextTimeToLogin).HasColumnType("datetime");
            entity.Property(e => e.Password)
                .IsRequired()
                .HasMaxLength(256);
            entity.Property(e => e.PhoneNumber)
                .IsRequired()
                .HasMaxLength(256);
            entity.Property(e => e.ProfileImage).HasMaxLength(256);

            entity.HasOne(d => d.City).WithMany(p => p.Users)
                .HasForeignKey(d => d.CityId)
                .HasConstraintName("FK_Users_Cities");

            entity.HasOne(d => d.ModifiedByNavigation).WithMany(p => p.InverseModifiedByNavigation)
                .HasForeignKey(d => d.ModifiedBy)
                .HasConstraintName("FK_Users_Users");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}