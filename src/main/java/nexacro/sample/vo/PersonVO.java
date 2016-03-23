package nexacro.sample.vo;

/**
 * PersonVO Class
 * 
 * @author Park SeongMin
 * @since 09.11.2015
 * @version 1.0
 * @see
 */
public class PersonVO {
    /**
     * Person 이름
     * (String)name
     */
    private String name;

    /**
     * Person 나이
     * (int)age
     */
    private int age;

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

}
