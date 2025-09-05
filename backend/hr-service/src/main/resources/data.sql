
INSERT INTO onboarding_task_template (department, description, formly_config_json, order_index, title) VALUES
(
    'HR',
    'Provide information about family members and emergency contacts',
    '{
        "formTitle": "Family Details Form",
        "formControls": [
            {
                "name": "fatherName",
                "label": "Father''s Name",
                "type": "input",
                "placeholder": "Enter father''s full name",
                "validators": [
                    {
                        "validatorName": "required",
                        "required": true,
                        "message": "Father''s name is required"
                    }
                ]
            },
            {
                "name": "motherName",
                "label": "Mother''s Name",
                "type": "input",
                "placeholder": "Enter mother''s full name",
                "validators": [
                    {
                        "validatorName": "required",
                        "required": true,
                        "message": "Mother''s name is required"
                    }
                ]
            },
            {
                "name": "emergencyContactName",
                "label": "Emergency Contact Name",
                "type": "input",
                "placeholder": "Enter name of emergency contact person",
                "validators": [
                    {
                        "validatorName": "required",
                        "required": true,
                        "message": "Emergency contact name is required"
                    }
                ]
            },
            {
                "name": "emergencyContactNumber",
                "label": "Emergency Contact Number",
                "type": "input",
                "placeholder": "Enter emergency contact number",
                "validators": [
                    {
                        "validatorName": "required",
                        "required": true,
                        "message": "Emergency contact number is required"
                    },
                    {
                        "validatorName": "pattern",
                        "pattern": "^[0-9]{10}$",
                        "message": "Enter a valid 10-digit contact number"
                    }
                ]
            }
        ]
    }',
    1,
    'Enter Family Details'
),

(
    'HR',
    'Fill in your academic qualifications',
    '{
        "formTitle": "Education Details Form",
        "formControls": [
            {
                "name": "highestDegree",
                "label": "Highest Degree",
                "type": "input",
                "placeholder": "Enter your highest qualification",
                "validators": [
                    {
                        "validatorName": "required",
                        "required": true,
                        "message": "Degree is required"
                    }
                ]
            },
            {
                "name": "university",
                "label": "University/College",
                "type": "input",
                "placeholder": "Enter the name of institution",
                "validators": [
                    {
                        "validatorName": "required",
                        "required": true,
                        "message": "Institution name is required"
                    }
                ]
            },
            {
                "name": "graduationYear",
                "label": "Year of Graduation",
                "type": "input",
                "placeholder": "YYYY",
                "validators": [
                    {
                        "validatorName": "required",
                        "required": true,
                        "message": "Graduation year is required"
                    },
                    {
                        "validatorName": "pattern",
                        "pattern": "^(19|20)\\d{2}$",
                        "message": "Enter a valid year"
                    }
                ]
            },
            {
                "name": "marks",
                "label": "Marks/Percentage",
                "type": "input",
                "placeholder": "Enter your score",
                "validators": [
                    {
                        "validatorName": "required",
                        "required": true,
                        "message": "Marks/percentage is required"
                    }
                ]
            }
        ]
    }',
    2,
    'Enter Education Details'
),
(
    'HR',
    'Provide your professional work history',
    '{
        "formTitle": "Work Experience Form",
        "formControls": [
            {
                "name": "companyName",
                "label": "Last Company Name",
                "type": "input",
                "placeholder": "Enter previous company name",
                "validators": [
                    {
                        "validatorName": "required",
                        "required": true,
                        "message": "Company name is required"
                    }
                ]
            },
            {
                "name": "designation",
                "label": "Designation",
                "type": "input",
                "placeholder": "Enter your job title",
                "validators": [
                    {
                        "validatorName": "required",
                        "required": true,
                        "message": "Designation is required"
                    }
                ]
            },
            {
                "name": "experienceYears",
                "label": "Years of Experience",
                "type": "input",
                "placeholder": "Enter number of years",
                "validators": [
                    {
                        "validatorName": "required",
                        "required": true,
                        "message": "Years of experience is required"
                    },
                    {
                        "validatorName": "pattern",
                        "pattern": "^\\d+(\\.\\d{1,2})?$",
                        "message": "Enter a valid number (e.g., 2 or 3.5)"
                    }
                ]
            },
            {
                "name": "noticePeriod",
                "label": "Notice Period (in days)",
                "type": "input",
                "placeholder": "Enter notice period served",
                "validators": [
                    {
                        "validatorName": "required",
                        "required": true,
                        "message": "Notice period is required"
                    }
                ]
            }
        ]
    }',
    3,
    'Enter Experience Details'
),
(
    'HR',
    'Upload your most recent resume in PDF format',
    '{
        "formTitle": "Resume Upload Form",
        "formControls": [
            {
                "name": "resumeFile",
                "label": "Upload Resume",
                "type": "file",
                "validators": [
                    {
                        "validatorName": "required",
                        "required": true,
                        "message": "Resume file is required"
                    },
                    {
                        "validatorName": "fileExtension",
                        "allowedExtensions": ["pdf"],
                        "message": "Only PDF files are allowed"
                    }
                ]
            },
            {
                "name": "resumeVersion",
                "label": "Resume Version",
                "type": "input",
                "placeholder": "e.g., v1.0, v2.3",
                "validators": [
                    {
                        "validatorName": "required",
                        "required": true,
                        "message": "Resume version is required"
                    }
                ]
            },
            {
                "name": "uploadedOn",
                "label": "Upload Date",
                "type": "date",
                "validators": [
                    {
                        "validatorName": "required",
                        "required": true,
                        "message": "Upload date is required"
                    }
                ]
            }
        ]
    }',
    4,
    'Upload Resume'
),
(
    'HR',
    'Upload government-issued ID for verification',
    '{
        "formTitle": "ID Proof Upload",
        "formControls": [
            {
                "name": "idProofNumber",
                "label": "ID Proof Number",
                "type": "input",
                "placeholder": "Enter Employee ID Proof number",
                "validators": [
                    {
                        "validatorName": "required",
                        "required": true,
                        "message": "ID Proof Number is required"
                    },
                    {
                        "validatorName": "minLength",
                        "minLength": 5,
                        "message": "ID Proof Number must be at least 5 characters"
                    }
                ]
            },
            {
                "name": "idProofFile",
                "label": "Upload ID Proof",
                "type": "file",
                "validators": [
                    {
                        "validatorName": "required",
                        "required": true,
                        "message": "ID Proof file is required"
                    }
                ]
            }
        ]
    }',
    5,
    'Submit ID Proof'
),
(
    'IT',
    'Generate and assign official email credentials to the employee',
    '{
        "formTitle": "Email ID Creation",
        "formControls": [
            {
                "name": "officialEmail",
                "label": "Official Email Address",
                "type": "input",
                "placeholder": "e.g., john.doe@company.com",
                "validators": [
                    {
                        "validatorName": "required",
                        "required": true,
                        "message": "Official email is required"
                    },
                    {
                        "validatorName": "pattern",
                        "pattern": "^[\\w.-]+@[\\w.-]+\\.\\w{2,}$",
                        "message": "Enter a valid email address"
                    }
                ]
            },
            {
                "name": "temporaryPassword",
                "label": "Temporary Password",
                "type": "input",
                "placeholder": "Generate a temporary password",
                "validators": [
                    {
                        "validatorName": "required",
                        "required": true,
                        "message": "Temporary password is required"
                    },
                    {
                        "validatorName": "minLength",
                        "minLength": 6,
                        "message": "Password must be at least 6 characters"
                    }
                ]
            }
        ]
    }',
    1,
    'Create Official Email ID'
),
(
    'IT',
    'Review and verify the documents submitted by the employee',
    '{
        "formTitle": "Document Verification",
        "formControls": [
            {
                "name": "documentLink",
                "label": "Submitted Document",
                "type": "readonly-link",
                "templateOptions": {
                    "text": "View Uploaded Document",
                    "url": "http://localhost:8082/api/documents/employee/{employeeId}"
                }
            },
            {
                "name": "isDocumentVerified",
                "label": "Document Verified",
                "type": "checkbox",
                "validators": [
                    {
                        "validatorName": "required",
                        "required": true,
                        "message": "Verification status is required"
                    }
                ]
            },
            {
                "name": "remarks",
                "label": "Remarks (if any)",
                "type": "textarea",
                "placeholder": "Add any notes about the verification"
            }
        ]
    }',
    2,
    'Approve Uploaded Documents'
),
(
    'IT',
    'Assign laptop, accessories, and other IT assets to the employee',
    '{
        "formTitle": "IT Asset Assignment Form",
        "formControls": [
            {
                "name": "laptopSerial",
                "label": "Laptop Serial Number",
                "type": "input",
                "placeholder": "Enter the serial number of the laptop",
                "validators": [
                    {
                        "validatorName": "required",
                        "required": true,
                        "message": "Laptop serial number is required"
                    }
                ]
            },
            {
                "name": "accessories",
                "label": "Accessories Provided",
                "type": "multicheckbox",
                "options": [
                    {
                        "label": "Mouse",
                        "value": "mouse"
                    },
                    {
                        "label": "Keyboard",
                        "value": "keyboard"
                    },
                    {
                        "label": "Headset",
                        "value": "headset"
                    }
                ],
                "validators": [
                    {
                        "validatorName": "required",
                        "required": true,
                        "message": "Please select at least one accessory"
                    }
                ]
            },
            {
                "name": "assetIssuedDate",
                "label": "Asset Issued On",
                "type": "date",
                "validators": [
                    {
                        "validatorName": "required",
                        "required": true,
                        "message": "Asset issued date is required"
                    }
                ]
            }
        ]
    }',
    3,
    'Provide IT Assets'
),
(
    'EMPLOYEE',
    'Upload a valid government-issued ID document for identity verification',
    '{
        "formTitle": "Employee ID Verification Form",
        "formControls": [
            {
                "name": "idType",
                "label": "ID Type",
                "type": "select",
                "class": "col-md-6",
                "options": [
                    {
                        "label": "Aadhar Card",
                        "value": "aadhar"
                    },
                    {
                        "label": "Passport",
                        "value": "passport"
                    },
                    {
                        "label": "Driving License",
                        "value": "driving_license"
                    },
                    {
                        "label": "Voter ID",
                        "value": "voter_id"
                    }
                ],
                "validators": [
                    {
                        "validatorName": "required",
                        "required": true,
                        "message": "ID Type is required"
                    }
                ]
            },
            {
                "name": "idNumber",
                "label": "ID Number",
                "type": "input",
                "placeholder": "Enter your ID number",
                "class": "col-md-6",
                "validators": [
                    {
                        "validatorName": "required",
                        "required": true,
                        "message": "ID Number is required"
                    },
                    {
                        "validatorName": "minLength",
                        "minLength": 5,
                        "message": "ID Number must be at least 5 characters"
                    }
                ]
            },
            {
                "name": "idFile",
                "label": "Upload ID Document",
                "type": "file",
                "class": "col-md-12",
                "validators": [
                    {
                        "validatorName": "required",
                        "required": true,
                        "message": "ID document upload is required"
                    },
                    {
                        "validatorName": "fileExtension",
                        "allowedExtensions": [
                            "pdf",
                            "jpg",
                            "jpeg",
                            "png"
                        ],
                        "message": "Only PDF or image files are allowed"
                    }
                ]
            }
        ]
    }',
    1,
    'Upload ID for Verification'
);