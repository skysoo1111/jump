

# chaining
    - http method
    - uri
    - retrieve
    - exchange
    - bodyToMono
    - map
    - flatMap
    - subcribe
    - error handling
        - onErrorReturn()
            : 정적 값으로 error 대체
                .onErrorReturn(99)
        - onErrorMap()
            : 예외를 catch하고 다른 예외로 대체
                .onErrorMap((error) -> {
                    throw new RuntimeException("custom error");
                })
        - onErrorResume()
            : 예외를 catch하여 대체 워크플로우 작성
                .onErrorResume((error) -> Flux.just(4,5,6))
        - onErrorContinue
            : 예외 발생시 에러를 처리하고 나머지 시퀀스 처리
                .onErrorContinue((error, i) -> {
                    System.out.println("Error index : " + i);
                })