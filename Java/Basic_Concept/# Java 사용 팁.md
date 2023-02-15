# Arrays.asList() vs Collections.singletonList()

intellij 에서는 기본적으로 Collections.singletonList() 를 사용하기를 권장한다.

기본적으로 Collections.singletonList() 를 사용하는 것이 불변이라 안전하며 속도, 메모리 측면에서 좋다.
다만, 리스트 내부의 값 변경이 필요한 경우 Arrays.asList()를 사용하자.


# @Transactional 사용시 rollback은?

기본적으로는 UnChecked Exception에 대해서만 rollback이 발생한다.

Checked Exception인 IoException, FileNotFoundException 같은 경우 rollbackOn or rollbackFor 로 rollback을 발생 시키려는 exception을 잡아줘야 한다.