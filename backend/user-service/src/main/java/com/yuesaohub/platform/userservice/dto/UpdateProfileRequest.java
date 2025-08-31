package com.yuesaohub.platform.userservice.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public class UpdateProfileRequest {
    
    // Basic Information
    @Size(max = 255, message = "Full name cannot exceed 255 characters")
    private String fullName;
    
    @Size(max = 255, message = "Display name cannot exceed 255 characters")
    private String displayName;
    
    @Min(value = 18, message = "Age must be at least 18")
    @Max(value = 100, message = "Age cannot exceed 100")
    private Integer age;
    
    @Size(max = 500, message = "Profile photo URL cannot exceed 500 characters")
    private String profilePhotoUrl;

    // Contact Information
    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Invalid phone number format")
    private String primaryPhone;
    
    @Size(max = 100, message = "WeChat ID cannot exceed 100 characters")
    private String wechatId;
    
    @Size(max = 500, message = "WeChat QR code URL cannot exceed 500 characters")
    private String wechatQrCodeUrl;
    
    @Size(max = 100, message = "Xiaohongshu handle cannot exceed 100 characters")
    private String xiaohongshuHandle;

    // Location & Service
    @Size(max = 100, message = "City cannot exceed 100 characters")
    private String city;
    
    @Size(max = 100, message = "Province cannot exceed 100 characters")
    private String province;
    
    @Size(max = 100, message = "Country cannot exceed 100 characters")
    private String country;
    
    private String serviceAreas;
    
    @Size(max = 255, message = "Current location cannot exceed 255 characters")
    private String currentLocation;
    
    private Boolean willingToRelocate;

    // Professional Information
    @Min(value = 0, message = "Years of experience cannot be negative")
    @Max(value = 50, message = "Years of experience cannot exceed 50")
    private Integer yearsOfExperience;
    
    private String languages;
    private String specializations;
    private String certifications;
    private String servicesOffered;
    
    @DecimalMin(value = "0.0", message = "Hourly rate cannot be negative")
    @DecimalMax(value = "1000.0", message = "Hourly rate cannot exceed 1000")
    private BigDecimal hourlyRate;

    // Rich Content
    @Size(max = 2000, message = "About me cannot exceed 2000 characters")
    private String aboutMe;
    
    private String professionalExperience;
    private String educationBackground;
    private String specialSkills;

    // Media (JSON arrays as strings)
    private String galleryPhotos;
    private String certificatesPhotos;

    // Default constructor
    public UpdateProfileRequest() {}

    // Getters and Setters
    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getProfilePhotoUrl() {
        return profilePhotoUrl;
    }

    public void setProfilePhotoUrl(String profilePhotoUrl) {
        this.profilePhotoUrl = profilePhotoUrl;
    }

    public String getPrimaryPhone() {
        return primaryPhone;
    }

    public void setPrimaryPhone(String primaryPhone) {
        this.primaryPhone = primaryPhone;
    }

    public String getWechatId() {
        return wechatId;
    }

    public void setWechatId(String wechatId) {
        this.wechatId = wechatId;
    }

    public String getWechatQrCodeUrl() {
        return wechatQrCodeUrl;
    }

    public void setWechatQrCodeUrl(String wechatQrCodeUrl) {
        this.wechatQrCodeUrl = wechatQrCodeUrl;
    }

    public String getXiaohongshuHandle() {
        return xiaohongshuHandle;
    }

    public void setXiaohongshuHandle(String xiaohongshuHandle) {
        this.xiaohongshuHandle = xiaohongshuHandle;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getServiceAreas() {
        return serviceAreas;
    }

    public void setServiceAreas(String serviceAreas) {
        this.serviceAreas = serviceAreas;
    }

    public String getCurrentLocation() {
        return currentLocation;
    }

    public void setCurrentLocation(String currentLocation) {
        this.currentLocation = currentLocation;
    }

    public Boolean getWillingToRelocate() {
        return willingToRelocate;
    }

    public void setWillingToRelocate(Boolean willingToRelocate) {
        this.willingToRelocate = willingToRelocate;
    }

    public Integer getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(Integer yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }

    public String getLanguages() {
        return languages;
    }

    public void setLanguages(String languages) {
        this.languages = languages;
    }

    public String getSpecializations() {
        return specializations;
    }

    public void setSpecializations(String specializations) {
        this.specializations = specializations;
    }

    public String getCertifications() {
        return certifications;
    }

    public void setCertifications(String certifications) {
        this.certifications = certifications;
    }

    public String getServicesOffered() {
        return servicesOffered;
    }

    public void setServicesOffered(String servicesOffered) {
        this.servicesOffered = servicesOffered;
    }

    public BigDecimal getHourlyRate() {
        return hourlyRate;
    }

    public void setHourlyRate(BigDecimal hourlyRate) {
        this.hourlyRate = hourlyRate;
    }

    public String getAboutMe() {
        return aboutMe;
    }

    public void setAboutMe(String aboutMe) {
        this.aboutMe = aboutMe;
    }

    public String getProfessionalExperience() {
        return professionalExperience;
    }

    public void setProfessionalExperience(String professionalExperience) {
        this.professionalExperience = professionalExperience;
    }

    public String getEducationBackground() {
        return educationBackground;
    }

    public void setEducationBackground(String educationBackground) {
        this.educationBackground = educationBackground;
    }

    public String getSpecialSkills() {
        return specialSkills;
    }

    public void setSpecialSkills(String specialSkills) {
        this.specialSkills = specialSkills;
    }

    public String getGalleryPhotos() {
        return galleryPhotos;
    }

    public void setGalleryPhotos(String galleryPhotos) {
        this.galleryPhotos = galleryPhotos;
    }

    public String getCertificatesPhotos() {
        return certificatesPhotos;
    }

    public void setCertificatesPhotos(String certificatesPhotos) {
        this.certificatesPhotos = certificatesPhotos;
    }
}
