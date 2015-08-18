
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaBuilder.Case;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Root;

import com.example.pojo.Employee;
import com.example.pojo.Target;
public class Test {
    private static final String PERSISTENCE_UNIT_NAME = "TestPersistence";
      private static EntityManagerFactory factory;
      public static void main(String[] args) {
        factory = Persistence.createEntityManagerFactory(PERSISTENCE_UNIT_NAME);
        EntityManager em = factory.createEntityManager();
        // read the existing entries and write to console
        Query q = em.createQuery("select e from Employee e");
        List<Employee> employeeList = q.getResultList();
        for (Employee employee : employeeList) {
          System.out.println(employee);
        }
        System.out.println("Size: " + employeeList.size());
        // create new todo
    
        CriteriaBuilder builder = em.getCriteriaBuilder();	
        CriteriaQuery<Target> query = builder.createQuery(Target.class);
        Root<Employee> employee = query.from(Employee.class);
       
   //builder.<String>selectCase().when(builder.equal(employee.get("name"),"a" ),"")
      Expression<String> cola = builder.function("MAX", String.class,  builder.<String>selectCase().when(builder.equal(employee.get("name"),"a" ),employee.get("email")).otherwise(""));
      Expression<String> colb = builder.function("MAX", String.class,  builder.<String>selectCase().when(builder.equal(employee.get("name"),"b" ),employee.get("email")).otherwise(""));
      query.groupBy(employee.get("department"));
      query.select(builder.construct(Target.class,employee.get("department"),cola,colb));
      

     TypedQuery<Target> qq = em.createQuery(query);
    List<Target> result = qq.getResultList();
      System.out.println("Result Size: " + result.size());
      for (Target t : result){
    	  System.out.println(t.getCola());
    	  System.out.println(t.getColb());
      }
   /*     .when(builder.equal(employee.get("name"),'a'),1).otherwise(null)
        em.getTransaction().begin();
        Employee emp = new Employee();
        emp.setName("c");
        emp.setEmail("c@gmail.com");
        emp.setDepartment("Finance");
        em.persist(emp);
        em.getTransaction().commit();
        em.close();
        */
      }
    }
