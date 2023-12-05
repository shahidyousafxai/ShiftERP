import React from "react";
import { Switch } from "@mui/material";
import MuiPhoneNumber from "material-ui-phone-number";
import { TextField } from "../../../../shared";

const BusinessInfo = ({
  provisionDetails,
  provisionDetailsEmpty,
  handleOnChange,
  handleStatusOnChange,
  handlePhoneOnChange,
  handleOnFocus,
}) => {
  return (
    <div className="flex flex-col justify-between py-[20px] px-[20px] bg-bgGray">
      <div className="border border-bgGray rounded bg-white pb-0.5">
        <h6 className="px-3 py-3">Business Info</h6>
        <form className="px-3">
          <div className="row">
            <div className="form-group col-md-6">
              <div className="form-row mb-3">
                <TextField
                  size="small"
                  label="Name"
                  fullWidth
                  helperText={
                    provisionDetailsEmpty?.companyName
                      ? "Name is required"
                      : provisionDetailsEmpty?.companyNameTaken
                      ? "The company name has already been taken"
                      : ""
                  }
                  error={
                    provisionDetailsEmpty?.companyName
                      ? true
                      : provisionDetailsEmpty?.companyNameTaken
                      ? true
                      : false
                  }
                  name="companyName"
                  disabled={true}
                  value={provisionDetails.companyName}
                  onChange={handleOnChange}
                  onFocus={handleOnFocus}
                />
              </div>
              <div className="form-row mb-3">
                <TextField
                  size="small"
                  label="DBA Name"
                  fullWidth
                  helperText={
                    provisionDetailsEmpty?.dbaName ? "DBA Name is required" : ""
                  }
                  error={provisionDetailsEmpty?.dbaName ? true : false}
                  name="dbaName"
                  disabled={true}
                  value={provisionDetails.dbaName}
                  onChange={handleOnChange}
                  onFocus={handleOnFocus}
                />
              </div>
              <div className="form-row mb-3">
                <MuiPhoneNumber
                  defaultCountry="us"
                  variant="outlined"
                  size="small"
                  label="Phone"
                  fullWidth
                  helperText={
                    provisionDetailsEmpty?.comapnyPhone
                      ? "Phone is required"
                      : provisionDetailsEmpty?.comapnyPhoneValid
                      ? "Phone is not valid"
                      : ""
                  }
                  error={
                    provisionDetailsEmpty?.comapnyPhone
                      ? true
                      : provisionDetailsEmpty?.comapnyPhoneValid
                      ? true
                      : false
                  }
                  disableAreaCodes
                  value={provisionDetails.comapnyPhone}
                  onChange={(e) => handlePhoneOnChange(e, "comapnyPhone")}
                  onFocus={handleOnFocus}
                />
              </div>
              <div className="form-row mb-3">
                <div className="ml-2 text-[11px] text-darkGray">
                  Active Status
                </div>
                <div className="-mt-1 text-[13px]">
                  <Switch
                    checked={
                      provisionDetails.companyStatus === 1 ? true : false
                    }
                    onChange={handleStatusOnChange}
                    value={provisionDetails.companyStatus}
                  />
                  {provisionDetails.companyStatus ? "Active" : "Inactive"}
                </div>
              </div>
            </div>
            <div className="form-group col-md-6">
              <div className="form-row mb-3">
                <TextField
                  size="small"
                  label="Address"
                  fullWidth
                  name="comapnyAddress"
                  helperText={
                    provisionDetailsEmpty?.comapnyAddress
                      ? "Address is required"
                      : ""
                  }
                  error={provisionDetailsEmpty?.comapnyAddress ? true : false}
                  value={provisionDetails.comapnyAddress}
                  onChange={handleOnChange}
                  onFocus={handleOnFocus}
                />
              </div>
              <div className="form-row mb-3">
                <TextField
                  size="small"
                  label="City"
                  fullWidth
                  name="companyCity"
                  helperText={
                    provisionDetailsEmpty?.companyCity ? "City is required" : ""
                  }
                  error={provisionDetailsEmpty?.companyCity ? true : false}
                  value={provisionDetails.companyCity}
                  onChange={handleOnChange}
                  onFocus={handleOnFocus}
                />
              </div>
              <div className="form-row row mb-3">
                <div className="col-md-8">
                  <TextField
                    size="small"
                    label="State"
                    fullWidth
                    name="companyState"
                    helperText={
                      provisionDetailsEmpty?.companyState
                        ? "State is required"
                        : ""
                    }
                    error={provisionDetailsEmpty?.companyState ? true : false}
                    value={provisionDetails.companyState}
                    onChange={handleOnChange}
                    onFocus={handleOnFocus}
                  />
                </div>
                <div className="col-md-4">
                  <TextField
                    size="small"
                    label="Zip"
                    fullWidth
                    name="companyZip"
                    helperText={
                      provisionDetailsEmpty?.companyZip
                        ? "Zip Code is required"
                        : ""
                    }
                    error={provisionDetailsEmpty?.companyZip ? true : false}
                    value={provisionDetails.companyZip}
                    onChange={handleOnChange}
                    onFocus={handleOnFocus}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="border border-bgGray rounded bg-white pb-0.5 mt-3">
        <h6 className="px-3 py-3">Billing Contact</h6>

        <form className="px-3">
          <div className="row">
            <div className="form-group col-md-6">
              <div className="form-row mb-3">
                <TextField
                  size="small"
                  label="First Name"
                  fullWidth
                  helperText={
                    provisionDetailsEmpty?.billingFirstName
                      ? "First Name is required"
                      : ""
                  }
                  error={provisionDetailsEmpty?.billingFirstName ? true : false}
                  name="billingFirstName"
                  value={provisionDetails.billingFirstName}
                  onChange={handleOnChange}
                  onFocus={handleOnFocus}
                />
              </div>
              <div className="form-row mb-3">
                <TextField
                  size="small"
                  label="Last Name"
                  fullWidth
                  helperText={
                    provisionDetailsEmpty?.billingLastName
                      ? "Last Name is required"
                      : ""
                  }
                  error={provisionDetailsEmpty?.billingLastName ? true : false}
                  name="billingLastName"
                  value={provisionDetails.billingLastName}
                  onChange={handleOnChange}
                  onFocus={handleOnFocus}
                />
              </div>
              <div className="form-row mb-3">
                <TextField
                  size="small"
                  label="Title"
                  fullWidth
                  helperText={
                    provisionDetailsEmpty?.billingTitle
                      ? "Billing Title is required"
                      : ""
                  }
                  error={provisionDetailsEmpty?.billingTitle ? true : false}
                  name="billingTitle"
                  // disabled={true}
                  value={provisionDetails.billingTitle}
                  onChange={handleOnChange}
                  onFocus={handleOnFocus}
                />
              </div>
              <div className="form-row mb-3">
                <TextField
                  size="small"
                  label="Email"
                  fullWidth
                  helperText={
                    provisionDetailsEmpty?.billingEmail
                      ? "Email is required"
                      : provisionDetailsEmpty?.billingEmailValid
                      ? "Email is not valid"
                      : ""
                  }
                  error={
                    provisionDetailsEmpty?.billingEmail
                      ? true
                      : provisionDetailsEmpty?.billingEmailValid
                      ? true
                      : false
                  }
                  name="billingEmail"
                  value={provisionDetails.billingEmail}
                  onChange={handleOnChange}
                  onFocus={handleOnFocus}
                />
              </div>
            </div>
            <div className="form-group col-md-6">
              <div className="form-row mb-3">
                <MuiPhoneNumber
                  defaultCountry="us"
                  variant="outlined"
                  size="small"
                  label="Contact Number"
                  fullWidth
                  helperText={
                    provisionDetailsEmpty?.billingContact
                      ? "Contact number is required"
                      : provisionDetailsEmpty?.billingContactValid
                      ? "Contact number is not valid"
                      : ""
                  }
                  error={
                    provisionDetailsEmpty?.billingContact
                      ? true
                      : provisionDetailsEmpty?.billingContactValid
                      ? true
                      : false
                  }
                  disableAreaCodes
                  value={provisionDetails.billingContact}
                  onChange={(e) => handlePhoneOnChange(e, "billingContact")}
                  onFocus={handleOnFocus}
                />
              </div>
              <div className="form-row mb-3">
                <TextField
                  size="small"
                  label="Home Address"
                  fullWidth
                  name="billingAddress"
                  helperText={
                    provisionDetailsEmpty?.billingAddress
                      ? "Address is required"
                      : ""
                  }
                  error={provisionDetailsEmpty?.billingAddress ? true : false}
                  value={provisionDetails.billingAddress}
                  onChange={handleOnChange}
                  onFocus={handleOnFocus}
                />
              </div>
              <div className="form-row mb-3">
                <TextField
                  size="small"
                  label="City"
                  fullWidth
                  name="billingCity"
                  helperText={
                    provisionDetailsEmpty?.billingCity ? "City is required" : ""
                  }
                  error={provisionDetailsEmpty?.billingCity ? true : false}
                  value={provisionDetails.billingCity}
                  onChange={handleOnChange}
                  onFocus={handleOnFocus}
                />
              </div>
              <div className="form-row row mb-3">
                <div className="col-md-8">
                  <TextField
                    size="small"
                    label="State"
                    fullWidth
                    name="billingState"
                    helperText={
                      provisionDetailsEmpty?.billingState
                        ? "State is required"
                        : ""
                    }
                    error={provisionDetailsEmpty?.billingState ? true : false}
                    value={provisionDetails.billingState}
                    onChange={handleOnChange}
                    onFocus={handleOnFocus}
                  />
                </div>
                <div className="col-md-4">
                  <TextField
                    size="small"
                    label="Zip"
                    fullWidth
                    name="billingZip"
                    helperText={
                      provisionDetailsEmpty?.billingZip
                        ? "Zip Code is required"
                        : ""
                    }
                    error={provisionDetailsEmpty?.billingZip ? true : false}
                    value={provisionDetails.billingZip}
                    onChange={handleOnChange}
                    onFocus={handleOnFocus}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default BusinessInfo;
