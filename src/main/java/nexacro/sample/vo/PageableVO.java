package nexacro.sample.vo;

/**
 * Pageable Class
 * 
 * @author Park SeongMin
 * @since 09.11.2015
 * @version 1.0
 * @see
 */
public class PageableVO extends DefaultVO {

	/** 현재페이지 */
    private int pageIndex = 1;

    /** 페이지갯수 */
    private int pageUnit = 10;

    /** 페이지사이즈 */
    private int pageSize = 10;

    /** firstIndex */
    private int firstIndex = 1;

    /** lastIndex */
    private int lastIndex = 1;

    /** recordCountPerPage */
    private int recordCountPerPage = 10;

    /**
     * @return the pageIndex
     */
    public int getPageIndex() {
        return pageIndex;
    }

    /**
     * @param pageIndex
     *            the pageIndex to set
     */
    public void setPageIndex(int pageIndex) {
        this.pageIndex = pageIndex;
    }

    /**
     * @return the pageUnit
     */
    public int getPageUnit() {
        return pageUnit;
    }

    /**
     * @param pageUnit
     *            the pageUnit to set
     */
    public void setPageUnit(int pageUnit) {
        this.pageUnit = pageUnit;
    }

    /**
     * @return the pageSize
     */
    public int getPageSize() {
        return pageSize;
    }

    /**
     * @param pageSize
     *            the pageSize to set
     */
    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    /**
     * @return the firstIndex
     */
    public int getFirstIndex() {
        return firstIndex;
    }

    /**
     * @param firstIndex
     *            the firstIndex to set
     */
    public void setFirstIndex(int firstIndex) {
        this.firstIndex = firstIndex;
    }

    /**
     * @return the lastIndex
     */
    public int getLastIndex() {
        return lastIndex;
    }

    /**
     * @param lastIndex
     *            the lastIndex to set
     */
    public void setLastIndex(int lastIndex) {
        this.lastIndex = lastIndex;
    }

    /**
     * @return the recordCountPerPage
     */
    public int getRecordCountPerPage() {
        return recordCountPerPage;
    }

    /**
     * @param recordCountPerPage
     *            the recordCountPerPage to set
     */
    public void setRecordCountPerPage(int recordCountPerPage) {
        this.recordCountPerPage = recordCountPerPage;
    }
    
}
