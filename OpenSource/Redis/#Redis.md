# Redis(Remote Dictionary Server) 특징
휘발성이며 영속성을 가진 Key-Value 형태의 in-memory 저장소

1. NoSQl 데이터 모델
   - Key-Value
   - Column : 하나의 Key에 Multi Value 가질 수 있음 (중첩된 HashMap 구조)
   - Document : Value가 Json이거나 XML Document를 갖는 모델
   - Graph : 관계에 특화된 모델

2. 휘발성이며 영속성 보장
   - in-memory 기반이다.
   - 때문에 빠른 read/write 속도를 가진다.
   - 모든 데이터가 메모리 안에 있기 때문에 캐시 관점에서 유용하다.
   - DB 부하를 줄인다.
   - snapshotting(RDB) 방식 : 순간적으로 메모리에 있는 데이터를 디스크 전체에 옮겨 담는 방식
   - AOF(Append On File) 방식 : 메모리에 있는 모든 데이터를 read/write event를 모두 log 파일에 기록하는 방식

3. Data Type
   - String
   - Set
   - Sorted Set
   - Hashes
   - List


failover 시 에러 발생 가능성 존재 
- 설정 정보 관련은?
   - cluster topology 시간 설정 30s
   - replicaset read preference 설정
~~~java
   private ClusterTopologyRefreshOptions getClusterClientOptions() {
        return ClusterTopologyRefreshOptions.builder()
                .dynamicRefreshSources(true)                                  // default: true
                //true로 설정하면, 발견된 모든 노드로부터 topology 정보를 얻어온다. false로 설정하면, 처음 설정한 seed 노드로부터로만 topology 정보를 얻어온다.
                .enablePeriodicRefresh(Duration.ofSeconds(30))
                //topology 정보가 변경되었는지 감지하는 시간 텀. 노드 교체 등으로 topology 변경이 예정되어 있다면 짧게 주어도 좋을 것 같다.
                .enableAllAdaptiveRefreshTriggers()
                //(default: 사용하지 않음): RefreshTrigger에 enum으로 설정된 모든 refresh 이벤트에 대해 topology 갱신을 실행한다. Redis cluster에서 MOVED, ACK 같은 refresh trigger 이벤트가 많이 발생하는 경우 계속 topology를 갱신하려고 해서 성능 이슈가 발생할 수가 있다.
                .adaptiveRefreshTriggersTimeout(Duration.ofSeconds(30))       // default: 30초
                //adaptive refresh 주기
                .build();
~~~