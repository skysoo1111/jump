# kotlin scope

1. Object reference 호출 방식이 it 이냐, this 냐
2. 반환 값이 Lambda result 냐, Object reference 냐


|Function|Object reference| Return value | Is extension function|
|---|----|---|---|
|let|it|Lambda result|Yes|
|run|it|Lambda result|Yes|
|run|-|Lambda result|No|
|with|this|Lambda result|No: 객체를 argument로 받아서 사용|
|apply|this|Object result|Yes|
|also|it|Object result|Yes|


## with
with 은 이미 생성된 객체에 일괄적인 작업을 처리할 때 유용하다. 실제로 공식 가이드에서는 with 을 사용하는 상황에 대해 “Grouping function calls on an object” 라고 설명하고 있다.

~~~kotlin
hyeon9mak.isCool = true
hyeon9mak.isAwesome = true
hyeon9mak.koreanName = “현구막”


with(hyeon9mak) {
    isCool = true
    isAwesome = true
    koreanName = “현구막"
}
~~~

## apply
with 은 인자로 context object 를 받지만, apply 는 extension function 이기 때문에 객체를 생성해서 할당하기 전에 사용이 가능하다. apply 코드 블록이 모두 수행된 후 인스턴스가 할당되기 때문에 apply 는 객체 생성시점에서 초기화를 할 때 유용하다.

~~~kotlin
val hyeon9mak = Person(
    email = "jinha3507@gmail.com",
    age = 28,
).apply { name = "현구막" }
~~~

## also
apply 와 굉장히 유사해보이는데 차이가 무엇일까? apply 는 Lambda function 에 인자를 넘겨주지 않기 때문에 this를 이용해 참조한다. 그에 반해 also는 Lambda function 에 인자를 넘겨주기 때문에 인자를 it 이나 다른 이름을 부여해 참조가 가능하다.

~~~kotlin
val people = listOf(
    Person(
        email = "jinha3507@gmail.com",
        age = 28,
    ),
    Person(
        email = "another@email.com",
        age = 58,
    )
)

people.first()
    .apply { 
        println("이메일 길이: ${email.length}")
        name = "현구막" 
    }

//<!-- it나 다른이름 참조가 가능하기 때문에 대상 식벽에 용이함 -->
people.first()
    .also { firstPerson ->
        println("이메일 길이: ${firstPerson.email.length}")
        println("현재 나이: ${firstPerson.age}")
    }.increaseAge()
~~~


## run
객체를 생성하거나 사용하는 시점에서 다양한 작업을 수행시킨 후 결과를 반환받고 싶을 때 사용하면 좋다. (공식 문서 속 “Object configuration and computing the result” 에 해당)
with 과 유사하지만, run 은 extension function 버전 때문에 객체를 생성해서 할당하기 전에 사용이 가능하다는 차이가 생긴다.

~~~kotlin
//<!-- 첫번째 버전, 가독성이 안좋아서 잘 안씀 -->
val nameLengthDouble = run { 
    val person = Person.withDefaultName()
    val personName = person.name
    personName.length * 2
}

//<!-- 첫번째 버전 -->
val nameDoubleLength = Person.withDefaultName()
    .run { name.length * 2 }

//<!-- null 회피용 -->
val nameDoubleLength = person?.run { name.length * 2 }
    ?: 0
~~~


## let 
객체를 생성하거나 사용하는 시점에서 이름을 부여하여 다양한 작업을 수행시키고 결과를 돌려받고 싶을 때 사용하면 좋다.
run 은 Lambda function 에 인자를 넘겨주지 않기 때문에 this를 이용해 참조한다. 그에 반해 let는 Lambda function 에 인자를 넘겨주기 때문에 인자를 it 이나 다른 이름을 부여해 참조가 가능하다.

~~~kotlin
// <!-- run 사용시 -->
val people = listOf(
    Person(
        email = "jinha3507@gmail.com",
        age = 28,
    ),
    Person(
        email = "another@email.com",
        age = 58,
    )
)

val firstPersonEmailDoubleLength = people.first()
    .run { email.length * 2 }

//<!-- let 사용시 -->
val people = listOf(
    Person(
        email = "jinha3507@gmail.com",
        age = 28,
    ),
    Person(
        email = "another@email.com",
        age = 58,
    )
)

val firstPersonEmailDoubleLength = people.first()
    .let { firstPerson -> 
        firstPerson.email.length * 2 
    } 
~~~


# null 체크 주의사항

~~~kotlin
fun process(string: String?) {
    string?.let { /*Do something*/   }
}

public final void process(@Nullable String string) {
   if (string != null) {
      boolean var4 = false;
      /*Do something*/
   }
}

~~~

> boolean 은 그다지 비용이 큰 자료형이 아니며 kotlin proguard 를 사용하는 경우 자동으로 제거된다는 의견도 있다. 때문에 let 의 편리함을 포기할 이유가 있냐는 이야기. 어쨌거나 추가변수는 초당 수천 번 호출되는 루프에선 문제가 될 수도 있다고 생각한다.

~~~kotlin
fun process(string: String?) {
    if (string != null) {
        /*Do something*/
    }
}
~~~

# null 체크 후 객체의 프로퍼티를 사용할 때

위 코드처럼 객체의 프로퍼티를 사용할 땐 Object reference 가 this 인 apply 나 run 을 사용해서 it 키워드를 걷어내는 것이 바람직하다. 예시에서는 프로퍼티의 상태를 변경하는 것이므로 apply 가 적합하다.
~~~kotlin
person?.let {
    it.name = "Hyeon9mak"
    it.age = 28
}

person?.apply {
    name = "Hyeon9mak"
    age = 28
}

~~~

# null 체크 후 객체의 변수를 사용한 다음 객체를 그대로 반환해야 할 때

객체 자신을 반환하여 추가 동작을 수행할 땐 also 를 사용하는 것이 바람직하다.

~~~kotlin
person?.let { hyeon9mak ->
    println("현구막 이름의 길이는? ${hyeon9mak.name.length}")
    hyeon9mak
}?.increaseAge()

person?.also { hyeon9mak ->
    println("현구막 이름의 길이는? ${hyeon9mak.name.length}")
}?.increaseAge()
~~~

# mutable 변수의 null check
if 키워드 내부에서도 ? 를 사용해서 변수에 접근해야한다. 이런 경우 let 을 사용하면 아래와 같이 간결하게 표현할 수 있다.
~~~kotlin
private var str: String? = null

fun process() {
    if (str != null) {
        println(str?.length)
    }
}

private var str: String? = null

fun process() {
    str?.let { println(it.length) }
}
~~~

# nullable 체이닝 

이런 경우 let 을 사용해서 nullable 체이닝을 끊어낼 수 있다.

~~~kotlin
fun process(string: String?): List? {
    return string?.asIterable()?.distinct()?.sorted()
}

@Nullable
public final List process(@Nullable String string) {
   List var2;
   if (string != null) {
      Iterable var10000 = StringsKt.asIterable(
                           (CharSequence)string);
      if (var10000 != null) {
         var2 = CollectionsKt.distinct(var10000);
         if (var2 != null) {
            var2 = CollectionsKt.sorted((Iterable)var2);
            return var2;
         }
      }
   }

   var2 = null;
   return var2;
}

fun process(string: String?): List? {
    return string?.let {
        it.asIterable().distinct().sorted()
    }
}
~~~