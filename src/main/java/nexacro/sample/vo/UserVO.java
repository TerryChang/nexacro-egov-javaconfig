package nexacro.sample.vo;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

/**
 * 
 * @author Park SeongMin
 * @since 08.12.2015
 * @version 1.0
 * @see
 */
public class UserVO extends DefaultVO {

    // Fields
	@NotNull(message = "user id is required.")
	@Size(min = 4, max = 20, message = "Please, Enter your id at least 4 Characters.")
    private String userId;
	
	@NotNull(message = "user namme is required.")
	@Size(max = 20, message = "Please, Enter your name.")
	private String userName;
	
	@NotNull(message = "password is required.")
	@Size(min = 4, max = 50, message = "Please, Enter your password at least 4 Characters.")
	private String password;

//	@Pattern(regexp = ".+@.+\\.[a-z]+", message = "Please, Verify your e-mail address.")
	@Pattern(regexp = ".+@.+\\.[a-z]+", message = "{errors.validation.email}") // message source
    private String email;
	
	private String enName;
    private String compPhone;
    private String phone;
    private String cellPhone;
    private String company;
    private String jobPosition;
    private String assignment;
    private String officerYn;
    private String fax;
    private String zipCode;
    private String address;
    private String compZipCode;
    private String compAddress;
    private String deptId;
    
    /**
     * @return the userId
     */
    public String getUserId() {
        return userId;
    }

    /**
     * @param userId
     *            the userId to set
     */
    public void setUserId(String userId) {
        this.userId = userId;
    }

    /**
     * @return the userName
     */
    public String getUserName() {
        return userName;
    }

    /**
     * @param userName
     *            the userName to set
     */
    public void setUserName(String userName) {
        this.userName = userName;
    }

    /**
     * @return the postId
     */
    public String getEnName() {
        return enName;
    }

    /**
     * @param enName
     *            the enName to set
     */
    public void setEnName(String enName) {
        this.enName = enName;
    }

    /**
     * @return the compPhone
     */
    public String getCompPhone() {
        return compPhone;
    }

    /**
     * @param compPhone
     *            the compPhone to set
     */
    public void setCompPhone(String compPhone) {
        this.compPhone = compPhone;
    }
    
    /**
     * @return the phone
     */
    public String getPhone() {
        return phone;
    }

    /**
     * @param phone the phone to set
     */
    public void setPhone(String phone) {
        this.phone = phone;
    }

    /**
     * @return the cellPhone
     */
    public String getCellPhone() {
        return cellPhone;
    }

    /**
     * @param cellPhone the cellPhone to set
     */
    public void setCellPhone(String cellPhone) {
        this.cellPhone = cellPhone;
    }

    /**
     * @return the company
     */
    public String getCompany() {
        return company;
    }

    /**
     * @param company the company to set
     */
    public void setCompany(String company) {
        this.company = company;
    }

    /**
     * @return the jobPosition
     */
    public String getJobPosition() {
        return jobPosition;
    }

    /**
     * @param jobPosition the jobPosition to set
     */
    public void setJobPosition(String jobPosition) {
        this.jobPosition = jobPosition;
    }

    /**
     * @return the assignment
     */
    public String getAssignment() {
        return assignment;
    }

    /**
     * @param assignment the assignment to set
     */
    public void setAssignment(String assignment) {
        this.assignment = assignment;
    }

    /**
     * @return the officerYn
     */
    public String getOfficerYn() {
        return officerYn;
    }

    /**
     * @param officerYn the officerYn to set
     */
    public void setOfficerYn(String officerYn) {
        this.officerYn = officerYn;
    }

    /**
     * @return the fax
     */
    public String getFax() {
        return fax;
    }

    /**
     * @param fax the fax to set
     */
    public void setFax(String fax) {
        this.fax = fax;
    }

    /**
     * @return the zipCode
     */
    public String getZipCode() {
        return zipCode;
    }

    /**
     * @param zipCode the zipCode to set
     */
    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    /**
     * @return the address
     */
    public String getAddress() {
        return address;
    }

    /**
     * @param address the address to set
     */
    public void setAddress(String address) {
        this.address = address;
    }

    /**
     * @return the compZipCode
     */
    public String getCompZipCode() {
        return compZipCode;
    }

    /**
     * @param compZipCode the compZipCode to set
     */
    public void setCompZipCode(String compZipCode) {
        this.compZipCode = compZipCode;
    }

    /**
     * @return the compAddress
     */
    public String getCompAddress() {
        return compAddress;
    }

    /**
     * @param compAddress the compAddress to set
     */
    public void setCompAddress(String compAddress) {
        this.compAddress = compAddress;
    }

    /**
     * @return the email
     */
    public String getEmail() {
        return email;
    }

    /**
     * @param email the email to set
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * @return the deptId
     */
    public String getDeptId() {
        return deptId;
    }

    /**
     * @param deptId the deptId to set
     */
    public void setDeptId(String deptId) {
        this.deptId = deptId;
    }

    /**
     * @return the password
     */
    public String getPassword() {
        return password;
    }

    /**
     * @param password the password to set
     */
    public void setPassword(String password) {
        this.password = password;
    }
}
