

## webflux 설정 
~~~java
return webClientBuild()
                .baseUrl(tvingAuthProperty.getHost())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .clientConnector(new ReactorClientHttpConnector(reactorResourceFactory, httpClient ->
                        HttpClient.create(connectionProvider)
                                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 10_000)
                                .responseTimeout(Duration.ofMillis(10_000))
                                .doOnConnected(connection ->
                                        connection.addHandlerLast(new ReadTimeoutHandler(10_000, TimeUnit.MILLISECONDS))
                                                .addHandlerLast(new WriteTimeoutHandler(10_000, TimeUnit.MILLISECONDS)))
                                .metrics(true, Function.identity())
                                .resolver(nameResolverSpec -> {
                                    nameResolverSpec.queryTimeout(Duration.ofSeconds(1));
                                    nameResolverSpec.cacheNegativeTimeToLive(Duration.ofSeconds(10));
                                })
                ))
                .filter(metricsWebClientFilterFunction)
                .build();
~~~