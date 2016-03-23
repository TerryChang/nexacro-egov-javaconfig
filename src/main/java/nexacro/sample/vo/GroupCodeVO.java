package nexacro.sample.vo;

import java.util.Date;

/**
 *
 * @author Park SeongMin
 * @since 09.11.2015
 * @version 1.0
 * @see
 */
public class GroupCodeVO extends DefaultVO {

    private String groupCd;
    private String groupNm;
    private String useFg;
    private String createUser;
    private Date createDt;
    private String updateUser;
    private Date updateDt;
    private String groupDesc;
    /**
     * @return the groupCd
     */
    public String getGroupCd() {
        return groupCd;
    }
    /**
     * @param groupCd the groupCd to set
     */
    public void setGroupCd(String groupCd) {
        this.groupCd = groupCd;
    }
    /**
     * @return the groupNm
     */
    public String getGroupNm() {
        return groupNm;
    }
    /**
     * @param groupNm the groupNm to set
     */
    public void setGroupNm(String groupNm) {
        this.groupNm = groupNm;
    }
    /**
     * @return the useFg
     */
    public String getUseFg() {
        return useFg;
    }
    /**
     * @param useFg the useFg to set
     */
    public void setUseFg(String useFg) {
        this.useFg = useFg;
    }
    /**
     * @return the createUser
     */
    public String getCreateUser() {
        return createUser;
    }
    /**
     * @param createUser the createUser to set
     */
    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }
    /**
     * @return the createDt
     */
    public Date getCreateDt() {
        return createDt;
    }
    /**
     * @param createDt the createDt to set
     */
    public void setCreateDt(Date createDt) {
        this.createDt = createDt;
    }
    /**
     * @return the updateUser
     */
    public String getUpdateUser() {
        return updateUser;
    }
    /**
     * @param updateUser the updateUser to set
     */
    public void setUpdateUser(String updateUser) {
        this.updateUser = updateUser;
    }
    /**
     * @return the updateDt
     */
    public Date getUpdateDt() {
        return updateDt;
    }
    /**
     * @param updateDt the updateDt to set
     */
    public void setUpdateDt(Date updateDt) {
        this.updateDt = updateDt;
    }
    /**
     * @return the groupDesc
     */
    public String getGroupDesc() {
        return groupDesc;
    }
    /**
     * @param groupDesc the groupDesc to set
     */
    public void setGroupDesc(String groupDesc) {
        this.groupDesc = groupDesc;
    }
    
}
