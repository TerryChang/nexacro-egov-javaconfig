package nexacro.sample.vo;

import com.nexacro.spring.data.DataSetRowTypeAccessor;
import com.nexacro.spring.data.DataSetSavedDataAccessor;

/**
 * 
 * @author Park SeongMin
 * @since 08.12.2015
 * @version 1.0
 * @see
 */
public class UnitVO implements DataSetRowTypeAccessor, DataSetSavedDataAccessor<UnitVO>{

    private String id;
    private String name;
    private int age;
    private float height;
    private int width;

    private int rowType;
    private UnitVO savedData;
    
    /**
     * @return the id
     */
    public String getId() {
        return id;
    }

    /**
     * @param id
     *            the id to set
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name
     *            the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return the age
     */
    public int getAge() {
        return age;
    }

    /**
     * @param age
     *            the age to set
     */
    public void setAge(int age) {
        this.age = age;
    }

    /**
     * @return the height
     */
    public float getHeight() {
        return height;
    }

    /**
     * @param height
     *            the height to set
     */
    public void setHeight(float height) {
        this.height = height;
    }

    /**
     * @return the width
     */
    public int getWidth() {
        return width;
    }

    /**
     * @param width
     *            the width to set
     */
    public void setWidth(int width) {
        this.width = width;
    }

    @Override
    public UnitVO getData() {
        return this.savedData;
    }

    @Override
    public void setData(UnitVO data) {
        this.savedData = data;
    }

    @Override
    public int getRowType() {
        return this.rowType;
    }

    @Override
    public void setRowType(int rowType) {
        this.rowType = rowType;
    }

}
