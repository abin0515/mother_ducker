package com.yuesaohub.platform.userservice.dto;

import java.math.BigDecimal;

public class CaregiverSearchItemDto {
    private Long id;
    private String displayName;
    private String profilePhotoUrl;
    private String province;
    private String languages;
    private String servicesOffered;
    private String specializations;
    private Integer yearsOfExperience;
    private Integer age;
    private Integer profileCompletionPercentage;
    private BigDecimal totalRating;
    private Integer totalReviews;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getProfilePhotoUrl() { return profilePhotoUrl; }
    public void setProfilePhotoUrl(String profilePhotoUrl) { this.profilePhotoUrl = profilePhotoUrl; }

    public String getProvince() { return province; }
    public void setProvince(String province) { this.province = province; }

    public String getLanguages() { return languages; }
    public void setLanguages(String languages) { this.languages = languages; }

    public String getServicesOffered() { return servicesOffered; }
    public void setServicesOffered(String servicesOffered) { this.servicesOffered = servicesOffered; }

    public String getSpecializations() { return specializations; }
    public void setSpecializations(String specializations) { this.specializations = specializations; }

    public Integer getYearsOfExperience() { return yearsOfExperience; }
    public void setYearsOfExperience(Integer yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public Integer getProfileCompletionPercentage() { return profileCompletionPercentage; }
    public void setProfileCompletionPercentage(Integer profileCompletionPercentage) { this.profileCompletionPercentage = profileCompletionPercentage; }

    public BigDecimal getTotalRating() { return totalRating; }
    public void setTotalRating(BigDecimal totalRating) { this.totalRating = totalRating; }

    public Integer getTotalReviews() { return totalReviews; }
    public void setTotalReviews(Integer totalReviews) { this.totalReviews = totalReviews; }
}


