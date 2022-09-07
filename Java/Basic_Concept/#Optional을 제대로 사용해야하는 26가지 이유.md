# [Optional을 바르게 사용해야 하는 26가지 이유](https://dzone.com/articles/using-optional-correctly-is-not-optional)

# Item 0: of(), ofNullable()

null 이 발생하는 경우 프로그램 동작에 영향을 미친다면 NPE를 발생시켜 프로그래머가 알 필요가 있다. 그런 경우 NPE를 발생시키는 of를 사용하는 것이 바람직하다.

~~~java
// collection.get("CASE")가 null 인 경우 NPE 발생
Optional<String> of = Optional.of(collection.get("CASE"));

// collection.get("CASE")가 null 인 경우 Optional.empty 반환
Optional<String> ofNullable = Optional.ofNullable(collection.get("CASE"));

// collection.get("CASE")가 null 인 경우 NPE 발생
Optional<String> ofNullable = Optional.ofNullable(collection.get("CASE")).orElseThrow();

~~~

# Item 1: Optional 변수에는 null을 할당하지 마라

Optional 변수는 null 대신 Optional.empty() 로 초기화 하자.
Optional은 container/box로 null로 초기화 가는 것은 무의미하다.

~~~java
❌ BAD
public Optional<Cart> fetchCart() {

    Optional<Cart> emptyCart = null;
    ...
}
~~~

~~~java
✅ GOOD
public Optional<Cart> fetchCart() {

    Optional<Cart> emptyCart = Optional.empty();
    ...
}  
~~~

# Item 2: Optional.get()을 호출하기 전에 Optional에 값이 있는지 확인하자

Optional.get()을 호출하기 전에 isPresent()로 검사하는 것을 잊지마라.

단, Optional.get()은 deprecated 되어가고 있다.

~~~java
❌ BAD
Optional<Cart> cart = ... ; // this is prone to be empty
...
// if "cart"is empty then this code will throw a java.util.NoSuchElementException
Cart myCart = cart.get();
~~~

~~~java
✅ GOOD
if (cart.isPresent()) {
    Cart myCart = cart.get();
    ... // do something with "myCart"
} else {
    ... // do something that doesn't call cart.get()
}
~~~

# Item 3: 값이 없을 때 Optional.orElse() 를 통해 이미 설정된 값을 반환하라

Optional.orElse()는 isPresent()-get()보다 나은 대안으로 사용된다.

> 단, orElse()는 Optional 값이 있는 경우에도 항상 수행되는 로직이기 때문에 **성능이 저하**된다는 단점이 존재한다.

~~~java
❌ BAD
public static final String USER_STATUS = "UNKNOWN";
...
public String findUserStatus(long id) {

    Optional<String> status = ... ; // prone to return an empty Optional

    if (status.isPresent()) {
        return status.get();
    } else {
        return USER_STATUS;
    }
}
~~~

~~~java
✅ GOOD
public static final String USER_STATUS = "UNKNOWN";
...
public String findUserStatus(long id) {

    Optional<String> status = ... ; // prone to return an empty Optional

    return status.orElse(USER_STATUS);
}
~~~

# Item 4: 값이 없을 때, Optional.orElseGet() 을 통해 이미 설정된 값을 반환하라

orElseGet()은 isPresent()-get()보다 나은 대안이며, orElse()에서 발생하는 성능 저하를 방지하는 대안으로 사용된다.

> orElseGet()은 orElse()와 다르게 값이 없을 때만 supplier가 제공된다.

~~~java
❌ BAD
public String computeStatus() {
    ... // some code used to compute status
}

public String findUserStatus(long id) {

    Optional<String> status = ... ; // prone to return an empty Optional

    if (status.isPresent()) {
        return status.get();
    } else {
        return computeStatus();
    }
}
~~~

~~~java
❌ BAD - 성능 저하
public String computeStatus() {
    ... // some code used to compute status
}

public String findUserStatus(long id) {

    Optional<String> status = ... ; // prone to return an empty Optional

    // computeStatus() is called even if "status" is not empty
    return status.orElse(computeStatus()); 
}
~~~

~~~java
✅ GOOD
public String computeStatus() {
    ... // some code used to compute status
}

public String findUserStatus(long id) {

    Optional<String> status = ... ; // prone to return an empty Optional

    // computeStatus() is called only if "status" is empty
    return status.orElseGet(this::computeStatus);
}
~~~

# Item 5: 값이 없을 때, java10 이후 orElseThrow() 를 통해 NoSuchElementException 예외를 던져라

orElseThrow()은 isPresent()-get()보다 나은 대안이며, 값이 없을 때 exception 을 던진다.

~~~java
❌ BAD
public String findUserStatus(long id) {

    Optional<String> status = ... ; // prone to return an empty Optional

    if (status.isPresent()) {
        return status.get();
    } else {
        throw new NoSuchElementException();        
    }
}
~~~


~~~java
✅ GOOD
public String findUserStatus(long id) {

    Optional<String> status = ... ; // prone to return an empty Optional

    return status.orElseThrow();
}
~~~

# Item 6: 값이 없을 때, orElseThrow(exception supplier) 를 통해 명시적으로 예외 처리를 하자

orElseThrow(exception supplier)은 isPresent()-get()보다 나은 대안이며, 발생 시키려는 exception이 NoSuchElementException인 경우 인수 없이 보내고 별도의 exception을 발생시키려면 인수로 전달할 수 있다.

~~~java
❌ BAD
public String findUserStatus(long id) {

    Optional<String> status = ... ; // prone to return an empty Optional

    if (status.isPresent()) {
        return status.get();
    } else {
        throw new IllegalStateException(); 
    }
}
~~~


~~~java
✅ GOOD
public String findUserStatus(long id) {

    Optional<String> status = ... ; // prone to return an empty Optional

    return status.orElseThrow(IllegalStateException::new);
}
~~~


# Item 7: Optional이 Null 참조가 필요한 경우 orElse(null)을 사용하라

Optional이 null 참조가 필요한 경우 사용하자. 굳이 null을 만들 필요는 없다.

~~~java
❌ BAD
Method myMethod = ... ;
...
// contains an instance of MyClass or empty if "myMethod" is static
Optional<MyClass> instanceMyClass = ... ;
...
if (instanceMyClass.isPresent()) {
    myMethod.invoke(instanceMyClass.get(), ...);  
} else {
    myMethod.invoke(null, ...);  
}  
~~~


~~~java
✅ GOOD
Method myMethod = ... ;
...
// contains an instance of MyClass or empty if "myMethod" is static
Optional<MyClass> instanceMyClass = ... ;
...
myMethod.invoke(instanceMyClass.orElse(null), ...); 
~~~

# Item 8: 값이 있다면 Optional을 사용하고 값이 없다면 아무것도 하지마라

ifPresent()는 isPresent()-get()보다 나은 대안이다.

~~~java
❌ BAD
Optional<String> status = ... ;
...
if (status.isPresent()) {
    System.out.println("Status: " + status.get());
}
~~~

~~~java
✅ GOOD
Optional<String> status ... ;
...
status.ifPresent(System.out::println);  
~~~

# Item 9: 값이 있다면 Optional을 사용하고 값이 없다면 else 작업을 수행하라 (java9)

ifPresentOrElse()는 isPresent()-get()보다 나은 대안이다.

orElseGet() 과의 차이점은?

~~~java
❌ BAD
Optional<String> status = ... ;

if(status.isPresent()) {
    System.out.println("Status: " + status.get());
} else {
    System.out.println("Status not found");
}
~~~

~~~java
✅ GOOD
Optional<String> status = ... ;

status.ifPresentOrElse(
    System.out::println, 
    () -> System.out.println("Status not found")
);
~~~

# Item 10: 값이 있다면 Optional을 반환하고, 없다면 미리 설정된 Optional을 반환하라

때때로 Optional이 비어있지 않은 경우, Optional 자체를 반환하기를 원할 때가 있다. 하지만 orElse()나 orElseGet()은 래핑되지 않은 값을 반환하므로 적절하지 않다. 


~~~java
❌ BAD
public Optional<String> fetchStatus() {

    Optional<String> status = ... ;
    Optional<String> defaultStatus = Optional.of("PENDING");

    if (status.isPresent()) {
        return status;
    } else {
        return defaultStatus;
    }  
}
~~~

~~~java
❌ BAD
public Optional<String> fetchStatus() {

    Optional<String> status = ... ;

    return status.orElseGet(() -> Optional.<String>of("PENDING"));
}
~~~

~~~java
✅ GOOD
public Optional<String> fetchStatus() {

    Optional<String> status = ... ;
    Optional<String> defaultStatus = Optional.of("PENDING");

    return status.or(() -> defaultStatus);
    // or, without defining "defaultStatus"
    return status.or(() -> Optional.of("PENDING"));
}
~~~

# Item 11: Optional.orElse()/orElsexxx()는 람다에서 isPresent()-get()을 완벽히 대체한다.

람다에서의 지원은 코드 중단을 막고 연결된 람다를 얻는데 사용할 수 있다.
ifPresent()와 ifPresentOrElse() 또는 or() 도 고려해보자.

~~~java
❌ BAD
List<Product> products = ... ;

Optional<Product> product = products.stream()
    .filter(p -> p.getPrice() < price)
    .findFirst();

if (product.isPresent()) {
    return product.get().getName();
} else {
    return "NOT FOUND";
}
~~~

~~~java
❌ BAD
List<Product> products = ... ;

Optional<Product> product = products.stream()
    .filter(p -> p.getPrice() < price)
    .findFirst();

return product.map(Product::getName)
    .orElse("NOT FOUND");
~~~

~~~java
✅ GOOD
List<Product> products = ... ;

return products.stream()
    .filter(p -> p.getPrice() < price)
    .findFirst()
    .map(Product::getName)
    .orElse("NOT FOUND");
~~~

~~~java
❌ BAD
Optional<Cart> cart = ... ;
Product product = ... ;
...
if(!cart.isPresent() || 
   !cart.get().getItems().contains(product)) {
    throw new NoSuchElementException();
}  
~~~

~~~java
✅ GOOD
Optional<Cart> cart = ... ;
Product product = ... ;
...
cart.filter(c -> c.getItems().contains(product))
    .orElseThrow();  
~~~

# Item 12: 값을 얻으려는 단일 목적으로 Optional 메서드를 연결해서 사용하지 마라

~~~java
❌ BAD
public String fetchStatus() {
    String status = ... ;

    return Optional.ofNullable(status).orElse("PENDING");
}
~~~

~~~java
✅ GOOD
public String fetchStatus() {
    String status = ... ;

    return status == null ? "PENDING" : status;
}
~~~

# Item 13: Optional을 필드 변수로 선언하지 마라

Optional은 필드에 사용하기 위한 것이 아니며 Serializable을 구현하지 않는다. Java Bean의 속성으로 사용하기 위한 것이 아니다.

Java Bean의 속성이란?

~~~java
❌ BAD
public class Customer {

    [access_modifier] [static] [final] Optional<String> zip;
    [access_modifier] [static] [final] Optional<String> zip = Optional.empty();
    ...
}
~~~

~~~java
✅ GOOD
public class Customer {

    [access_modifier] [static] [final] String zip;
    [access_modifier] [static] [final] String zip = "";
    ...
}
~~~

# Item 14: 생성자 변수로 Optional을 사용하지 마라

~~~java
❌ BAD
public class Customer {

    private final String name;               // cannot be null
    private final Optional<String> postcode; // optional field, thus may be null

    public Customer(String name, Optional<String> postcode) {
        this.name = Objects.requireNonNull(name, () -> "Name cannot be null");
        this.postcode = postcode;
    }

    public Optional<String> getPostcode() {
        return postcode;
    }
    ...
}
~~~

~~~java
✅ GOOD
public class Customer {

    private final String name;     // cannot be null
    private final String postcode; // optional field, thus may be null

    public Cart(String name, String postcode) {
        this.name = Objects.requireNonNull(name, () -> "Name cannot be null");
        this.postcode = postcode;
    }

    public Optional<String> getPostcode() {
        return Optional.ofNullable(postcode);
    }
    ...
}
~~~

# Item 15: Setter 변수로 Optional을 사용하지 마라

~~~java
❌ BAD
@Entity
public class Customer implements Serializable {

    private static final long serialVersionUID = 1L;
    ...
    @Column(name="customer_zip")
    private Optional<String> postcode; // optional field, thus may be null

     public Optional<String> getPostcode() {
       return postcode;
     }

     public void setPostcode(Optional<String> postcode) {
       this.postcode = postcode;
     }
     ...
}
~~~

~~~java
✅ GOOD
@Entity
public class Customer implements Serializable {

    private static final long serialVersionUID = 1L;
    ...
    @Column(name="customer_zip")
    private String postcode; // optional field, thus may be null

    public Optional<String> getPostcode() {
      return Optional.ofNullable(postcode);
    }

    public void setPostcode(String postcode) {
       this.postcode = postcode;
    }
    ...
}
~~~

# Item 16: 메서드 변수로 Optional을 사용하지 마라

~~~java
❌ BAD
public void renderCustomer(Cart cart, Optional<Renderer> renderer,
                           Optional<String> name) {     
    if (cart == null) {
        throw new IllegalArgumentException("Cart cannot be null");
    }

    Renderer customerRenderer = renderer.orElseThrow(
        () -> new IllegalArgumentException("Renderer cannot be null")
    );    

    String customerName = name.orElseGet(() -> "anonymous"); 
    ...
}

// call the method - don't do this
renderCustomer(cart, Optional.<Renderer>of(CoolRenderer::new), Optional.empty());
~~~

~~~java
✅ GOOD
public void renderCustomer(Cart cart, Renderer renderer, String name) {

    if (cart == null) {
        throw new IllegalArgumentException("Cart cannot be null");
    }

    if (renderer == null) {
        throw new IllegalArgumentException("Renderer cannot be null");
    }

    String customerName = Objects.requireNonNullElseGet(name, () -> "anonymous");
    ...
}

// call this method
renderCustomer(cart, new CoolRenderer(), null);
~~~

~~~java
✅ GOOD
// NPE를 대신 반환
public void renderCustomer(Cart cart, Renderer renderer, String name) {

    Objects.requireNonNull(cart, "Cart cannot be null");        
    Objects.requireNonNull(renderer, "Renderer cannot be null");        

    String customerName = Objects.requireNonNullElseGet(name, () -> "anonymous");
    ...
}

// call this method
renderCustomer(cart, new CoolRenderer(), null);
~~~

~~~java
✅ GOOD
// NPE 대신 명시적인 Exception 반환
public final class MyObjects {

    private MyObjects() {
        throw new AssertionError("Cannot create instances for you!");
    }

    public static <T, X extends Throwable> T requireNotNullOrElseThrow(T obj, 
        Supplier<? extends X> exceptionSupplier) throws X {       

        if (obj != null) {
            return obj;
        } else { 
            throw exceptionSupplier.get();
        }
    }
}

public void renderCustomer(Cart cart, Renderer renderer, String name) {

    MyObjects.requireNotNullOrElseThrow(cart, 
                () -> new IllegalArgumentException("Cart cannot be null"));
    MyObjects.requireNotNullOrElseThrow(renderer, 
                () -> new IllegalArgumentException("Renderer cannot be null"));    

    String customerName = Objects.requireNonNullElseGet(name, () -> "anonymous");
    ...
}

// call this method
renderCustomer(cart, new CoolRenderer(), null); 
~~~

# Item 17: Optional을 사용하여 빈 컬렉션이나 빈 배열을 반환하지 마라

~~~java
❌ BAD
public Optional<List<String>> fetchCartItems(long id) {

    Cart cart = ... ;    
    List<String> items = cart.getItems(); // this may return null

    return Optional.ofNullable(items);
}
~~~

~~~java
✅ GOOD
public List<String> fetchCartItems(long id) {

    Cart cart = ... ;    
    List<String> items = cart.getItems(); // this may return null

    return items == null ? Collections.emptyList() : items;
}
~~~

# Item 18: 컬렉션에서 Optional 사용을 피하라

컬렉션에 들어간 null 값을 처리하기 위해 Optional을 사용했을 때 성능 패널티 등의 문제가 발생한다.

Optional을 cost-free 가 아니며, 메모리를 수집하고 소비하는 또 하나의 객체임을 명심하자.

~~~java
❌ BAD
Map<String, Optional<String>> items = new HashMap<>();
items.put("I1", Optional.ofNullable(...));
items.put("I2", Optional.ofNullable(...));
...

Optional<String> item = items.get("I1");

if (item == null) {
    System.out.println("This key cannot be found");
} else {
    String unwrappedItem = item.orElse("NOT FOUND");
    System.out.println("Key found, Item: " + unwrappedItem);
}
~~~

~~~java
✅ GOOD
Map<String, String> items = new HashMap<>();
items.put("I1", "Shoes");
items.put("I2", null);
...
// get an item
String item = get(items, "I1");  // Shoes
String item = get(items, "I2");  // null
String item = get(items, "I3");  // NOT FOUND

private static String get(Map<String, String> map, String key) {
  return map.getOrDefault(key, "NOT FOUND");
}
~~~

Optional을 통한 컬렉션의 접근 보다 아래와 같은 방법을 사용하자
- containsKey() 메서드 사용
- HashMap을 통한 간단한 구현
- Java 8의 computeIfAbsent() 메서드 사용
- Apache Commons의 DefaultedMap 사용

아래의 경우는 더 최악이다.

~~~java
❌❌ BAD
Map<Optional<String>, String> items = new HashMap<>();
Map<Optional<String>, Optional<String>> items = new HashMap<>();
~~~

# Item 19: Optional.of()와 Optional.ofNullable()을 혼동하지 마라

값이 null일 경우  
- Optional.of()는 NPE를 반환한다.
- Optional.ofNullable()은 Optional.empty를 반환한다.

> 값이 무조건 있는 경우는 of()를 null이 발생할 수 있는 경우는 ofNullable()을 사용하자.

~~~java
❌ BAD
public Optional<String> fetchItemName(long id) {

    String itemName = ... ; // this may result in null
    ...
    return Optional.of(itemName); // this throws NPE if "itemName" is null :(
}
~~~

~~~java
✅ GOOD
public Optional<String> fetchItemName(long id) {

    String itemName = ... ; // this may result in null
    ...
    return Optional.ofNullable(itemName); // no risk for NPE    
}
~~~

~~~java
❌ BAD 
// 값이 무조건 있는 경우에는 ofNullable 은 의미가 없다.
return Optional.ofNullable("PENDING"); // ofNullable doesn't add any value
~~~

~~~java
✅ GOOD
// 값이 무조건 있는 경우에는 of()를 사용하자
return Optional.of("PENDING"); // no risk to NPE
~~~

# Item 20: Optional<T> 가 아닌 Non-Generic인 OptionalInt, OptionalLong, OptionalDouble 를 사용해라

제네릭을 사용하더라도 박싱/언박싱으로 코드가 동작하지만 이는 성능 저하를 유발할 수 있다. 따라서 제네릭 타입을 사용해야 하는 명확한 이유가 있지 않다면 Non-generic을 사용하라.

~~~java
❌ BAD
Optional<Integer> price = Optional.of(50);
Optional<Long> price = Optional.of(50L);
Optional<Double> price = Optional.of(50.43d);
~~~

~~~java
✅ GOOD
OptionalInt price = OptionalInt.of(50);           // unwrap via getAsInt()
OptionalLong price = OptionalLong.of(50L);        // unwrap via getAsLong()
OptionalDouble price = OptionalDouble.of(50.43d); // unwrap via getAsDouble()
~~~

# Item 21: Optional 값 비교시에는 래핑되지 않은 값이 필요하지 않다.

Optional#equals가 Optional 객체가 아닌 래핑되지 않은 값을 비교하기 때문이다.

~~~java
// Optional#equals 코드
@Override
public boolean equals(Object obj) {
    if (this == obj) {
        return true;
    }

    if (!(obj instanceof Optional)) {
        return false;
    }

    Optional<?> other = (Optional<?>) obj;
    return Objects.equals(value, other.value);
}
~~~

~~~java
❌ BAD
Optional<String> actualItem = Optional.of("Shoes");
Optional<String> expectedItem = Optional.of("Shoes");        

assertEquals(expectedItem.get(), actualItem.get());
~~~

~~~java
✅ GOOD
Optional<String> actualItem = Optional.of("Shoes");
Optional<String> expectedItem = Optional.of("Shoes");        

assertEquals(expectedItem, actualItem);
~~~

# Item 22: Optional 값을 변환할 때에는 Optional.map()과 Optional.flatMap()을 사용하자

~~~java
❌ BAD
Optional<String> lowername ...; // may be empty

// transform name to upper case
Optional<String> uppername;
if (lowername.isPresent()) {
    uppername = Optional.of(lowername.get().toUpperCase());
} else {
    uppername = Optional.empty();
}
~~~

~~~java
✅ GOOD
Optional<String> lowername ...; // may be empty

// transform name to upper case
Optional<String> uppername = lowername.map(String::toUpperCase);

~~~

~~~java
❌ BAD
List<Product> products = ... ;

Optional<Product> product = products.stream()
    .filter(p -> p.getPrice() < 50)
    .findFirst();

String name;
if (product.isPresent()) {
    name = product.get().getName().toUpperCase();
} else {
    name = "NOT FOUND";
}

// getName() return a non-null String
public String getName() {
    return name;
}
~~~

~~~java
✅ GOOD
List<Product> products = ... ;

String name = products.stream()
    .filter(p -> p.getPrice() < 50)
    .findFirst()
    .map(Product::getName)
    .map(String::toUpperCase)
    .orElse("NOT FOUND");

// getName() return a String
public String getName() {
    return name;
}
~~~

# Item 23: filter()를 사용하여 명시적으로 래핑 값을 해제하지 말고 특정 조건에 부합되는 값을 찾자

filter()를 사용하면 Optional 값을 꺼내서 조건 비교하는 것이 아니라 Optional 채로 비교 가능하다.

~~~java
❌ BAD
public boolean validatePasswordLength(User userId) {

    Optional<String> password = ...; // User password

    if (password.isPresent()) {
        return password.get().length() > 5;
    }

    return false;
}
~~~

~~~java
✅ GOOD
public boolean validatePasswordLength(User userId) {

    Optional<String> password = ...; // User password

    return password.filter((p) -> p.length() > 5).isPresent();
}
~~~

# Item 24: Stream API에서 Optional 값을 제어하고 연결해서 사용해야 하는가?

그렇다면 Optional.stream을 사용하자.

~~~java
❌ BAD
public List<Product> getProductList(List<String> productId) {

    return productId.stream()
        .map(this::fetchProductById)
        .filter(Optional::isPresent)
        .map(Optional::get)
        .collect(toList());
}

public Optional<Product> fetchProductById(String id) {
    return Optional.ofNullable(...);
}
~~~

~~~java
✅ GOOD
public List<Product> getProductList(List<String> productId) {
    return productId.stream()
        .map(this::fetchProductById)
        .flatMap(Optional::stream)
        .collect(toList());
}

public Optional<Product> fetchProductById(String id) {
    return Optional.ofNullable(...);
}
~~~

# Item 25: Optional을 == 비교하지 마라

~~~java
❌ BAD
Product product = new Product();
Optional<Product> op1 = Optional.of(product);
Optional<Product> op2 = Optional.of(product);

// op1 == op2 => false, expected true
if (op1 == op2) { ...
~~~

~~~java
✅ GOOD
Product product = new Product();
Optional<Product> op1 = Optional.of(product);
Optional<Product> op2 = Optional.of(product);

// op1.equals(op2) => true,expected true
if (op1.equals(op2)) { ...
~~~

~~~java
❌❌ BAD
Optional<Product> product = Optional.of(new Product());

synchronized(product) {
    ...
}
~~~

# Item 26: Optional 값이 비어있는지를 java11 에서는 isEmpty()로 보다 쉽게 사용하자

~~~java
❌ BAD
public Optional<String> fetchCartItems(long id) {

    Cart cart = ... ; // this may be null
    ...    
    return Optional.ofNullable(cart);
}

public boolean cartIsEmpty(long id) {

    Optional<String> cart = fetchCartItems(id);

    return !cart.isPresent();
}
~~~

~~~java
✅ GOOD
public Optional<String> fetchCartItems(long id) {

    Cart cart = ... ; // this may be null
    ...    
    return Optional.ofNullable(cart);
}

public boolean cartIsEmpty(long id) {

    Optional<String> cart = fetchCartItems(id);

    return cart.isEmpty();
}
~~~

