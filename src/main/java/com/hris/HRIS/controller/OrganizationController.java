package com.hris.HRIS.controller;

import com.hris.HRIS.dto.ApiResponse;
import com.hris.HRIS.model.CredentialsModel;
import com.hris.HRIS.model.EmployeeModel;
import com.hris.HRIS.model.OrganizationModel;
import com.hris.HRIS.repository.CredentialsRepository;
import com.hris.HRIS.repository.EmployeeRepository;
import com.hris.HRIS.repository.OrganizationRepository;
import com.hris.HRIS.service.EmailService;
import com.hris.HRIS.service.EncryptionService;
import com.hris.HRIS.service.SystemAutomateService;
import com.hris.HRIS.shared.objects.JobData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;

@RestController
@RequestMapping("/api/v1/organization")
public class OrganizationController {
    @Autowired
    OrganizationRepository organizationRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    CredentialsRepository credentialsRepository;

    @Autowired
    SystemAutomateService systemAutomateService;

    @Autowired
    EmailService emailService;

    @Autowired
    EncryptionService encryptionService;

    @PostMapping("/save")
    public ResponseEntity<ApiResponse> saveOrganization(@RequestBody OrganizationModel organizationModel) throws Exception {
        OrganizationModel orgModel = organizationRepository.save(organizationModel);

        JobData jobData = new JobData();
        jobData.setPosition("Administrator");
        jobData.setDepartment("N/A");
        jobData.setDoj(String.valueOf(new Date()));
        jobData.setSalary("N/A");
        jobData.setEmployementType("N/A");
        jobData.setJobGrade("N/A");
        jobData.setPersonalGrade("N/A");
        jobData.setSupervisor("N/A");
        jobData.setBusinessUnit("N/A");
        jobData.setLocation("N/A");
        jobData.setBranch("N/A");

        EmployeeModel employeeModel = new EmployeeModel();
        employeeModel.setName(organizationModel.getContactPerson());
        employeeModel.setEmail(organizationModel.getContactEmail());
        employeeModel.setPhone(organizationModel.getPhone());
        employeeModel.setOrganizationId(orgModel.getId());
        employeeModel.setJobData(jobData);
        employeeModel.setDob("N/A");
        employeeModel.setAddress("N/A");
        employeeModel.setNic("N/A");
        employeeModel.setMaritalStatus("N/A");
        employeeModel.setGender("N/A");
        employeeModel.setReligion("N/A");
        employeeModel.setNationality("N/A");
        employeeModel.setDateOfRetirement("N/A");
        employeeModel.setDateOfExit("N/A");
        employeeModel.setExitReason("N/A");
        employeeModel.setDateOfContractEnd("N/A");
        // Set default photo from resources directory
        try {
            Resource defaultPhotoResource = new ClassPathResource("default_profile.jpg");
            byte[] defaultPhotoBytes = Files.readAllBytes(defaultPhotoResource.getFile().toPath());
            employeeModel.setPhoto(defaultPhotoBytes);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Failed to load default photo"));
        }
        employeeModel.setLevel(0);
        employeeModel.setStatus("N/A");
        employeeModel.setAnnualLeaveBalance(14);
        employeeModel.setSickLeaveBalance(7);
        employeeModel.setCasualLeaveBalance(7);
        employeeModel.setMaternityLeaveBalance(84);
        employeeModel.setPaternityLeaveBalance(3);
        employeeModel.setNoPayLeaveBalance(14);

        EmployeeModel emp = employeeRepository.save(employeeModel);
        systemAutomateService.updateOrganizationEmployees(emp);

        String password = String.valueOf(random_Password(10));
        String encryptedPassword = encryptionService.encryptPassword(password);
        String name = employeeModel.getName().split(" ")[0];
        String para = "Thank you for choosing us as your organization's HR Information platform. We can help you to manage your organization easily and in flexible ways. You are the main administrator of your organization and start your journey with SPARKC HR Systems.\n\n" +
                "Email: "+organizationModel.getContactEmail()+"\n" +
                "Password: "+password+"\n\n" +
                "We hope you can work with us on a long journey and for any further assistance, don't hesitate to get in touch with us at support@sparckc.com.\n\n";
        String tag = "Best Regards,\nTeam SPARKC.\n\n";
        String footer = "Powered by SparkC";

        CredentialsModel credentialsModel = new CredentialsModel();
        credentialsModel.setEmail(organizationModel.getContactEmail());
        credentialsModel.setPassword(encryptedPassword);
        credentialsModel.setLevel("0");
        credentialsRepository.save(credentialsModel);

        emailService.sendSimpleEmail(organizationModel.getEmail(), "Organization Registration", "Dear " + name + ",\n" + para + tag + footer);

        ApiResponse apiResponse = new ApiResponse("Organization saved successfully");
        return ResponseEntity.ok(apiResponse);
    }

    static char[] random_Password(int len) {
        String Capital_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String Small_chars = "abcdefghijklmnopqrstuvwxyz";
        String numbers = "0123456789";
        String symbols = "!@#$%^&*_=+-/.?<>)";


        String values = Capital_chars + Small_chars +
                numbers + symbols;

        // Using random method
        Random rndm_method = new Random();

        char[] password = new char[len];

        for (int i = 0; i < len; i++) {
            password[i] = values.charAt(rndm_method.nextInt(values.length()));
        }
        return password;
    }

    @GetMapping("/get/all")
    public List<OrganizationModel> getAllOrganization() {
        return organizationRepository.findAll();
    }

    @GetMapping("/get/id/{id}")
    public ResponseEntity<OrganizationModel> getOrganizationById(@PathVariable String id) {
        Optional<OrganizationModel> organizationModelOptional = organizationRepository.findById(id);

        return organizationModelOptional.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/get/email/{email}")
    public ResponseEntity<OrganizationModel> getOrganizationByEmail(@PathVariable String email) {
        Optional<OrganizationModel> organizationModelOptional = organizationRepository.findByEmail(email);

        return organizationModelOptional.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update/id/{id}")
    public ResponseEntity<ApiResponse> updateOrganization(@PathVariable String id,
                                                          @RequestPart(value = "photo", required = false) MultipartFile photo,
                                                          @RequestParam("organizationName") String organizationName,
                                                          @RequestParam("description") String description,
                                                          @RequestParam("contactPerson") String contactPerson,
                                                          @RequestParam("contactEmail") String contactEmail,
                                                          @RequestParam("email") String email,
                                                          @RequestParam("address") String address,
                                                          @RequestParam("phone") String phone,
                                                          @RequestParam("telephone") String telephone,
                                                          @RequestParam("contractStart") String contractStart,
                                                          @RequestParam("contractEnd") String contractEnd,
                                                          @RequestParam("status") String status) throws IOException {
        Optional<OrganizationModel> organizationModelOptional = organizationRepository.findById(id);

        if (organizationModelOptional.isPresent()) {
            OrganizationModel existingOrganization = organizationModelOptional.get();

            if (photo != null) {
                existingOrganization.setPhoto(photo.getBytes());
            }
            existingOrganization.setOrganizationName(organizationName);
            existingOrganization.setDescription(description);
            existingOrganization.setContactPerson(contactPerson);
            existingOrganization.setContactEmail(contactEmail);
            existingOrganization.setEmail(email);
            existingOrganization.setAddress(address);
            existingOrganization.setPhone(phone);
            existingOrganization.setTelephone(telephone);
            existingOrganization.setContractStart(contractStart);
            existingOrganization.setContractEnd(contractEnd);
            existingOrganization.setStatus(status);

            organizationRepository.save(existingOrganization);

            ApiResponse apiResponse = new ApiResponse("Organization updated successfully");
            return ResponseEntity.ok(apiResponse);
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/id/{id}")
    public ResponseEntity<ApiResponse> deleteOrganization(@PathVariable String id) {
        organizationRepository.deleteById(id);

        ApiResponse apiResponse = new ApiResponse("Organization deleted successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/updateLeaves/{id}")
    public ResponseEntity<ApiResponse> updateLeaves(@PathVariable String id, @RequestBody OrganizationModel organizationModel) {
        Optional<OrganizationModel> organizationModelOptional = organizationRepository.findById(id);

        if (organizationModelOptional.isPresent()) {
            OrganizationModel existingOrganization = organizationModelOptional.get();
            existingOrganization.setAnnualLeave(organizationModel.getAnnualLeave());
            existingOrganization.setSickLeave(organizationModel.getSickLeave());
            existingOrganization.setMaternityLeave(organizationModel.getMaternityLeave());
            existingOrganization.setPaternityLeave(organizationModel.getPaternityLeave());
            existingOrganization.setNoPayLeave(organizationModel.getNoPayLeave());
            existingOrganization.setCasualLeave(organizationModel.getCasualLeave());
            existingOrganization.setIsLeavesConfigured(true);

            organizationRepository.save(existingOrganization);

            ApiResponse apiResponse = new ApiResponse("Leaves updated successfully");
            return ResponseEntity.ok(apiResponse);
        }

        return ResponseEntity.notFound().build();
    }
}
