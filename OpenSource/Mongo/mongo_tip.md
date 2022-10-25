- noSql db는 태생적으로 rdbms보다 I/O가 높아질수 밖에 없다. 필드를 표시하므로
- 몽고는 write conflict 라는 수치를 항상 모니터링 해야한다. (write lock이 걸린 document에 접근할때 생김)
- 몽고는 데이터 수정이 생기면 기존 영역을 건드는게 아니라 새로운 영역에 저장되고 기존의 링크를 변경한다. (Postgresql이 이런 방식)

- document의 업데이트가 빈번히 발생한다면 몽고db를 사용하지 마라 -> document db 권장
- 동시성 처리는 document db까지 사용하면 안된다.
- schemaless한 장점만을 노릴수 있다.

- sharding이 가능한 데이터 플랫폼 중에 secondary index를 완전히 만드는 것은 몽고가 거의 유일하기 때문에 큰 장점이다.
- secondary index로 인해 chunk migration시 부하가 발생할 수 밖에 없다.
- replica set 서비스 초기, sharding cluster는 서비스가 자리잡고 커질 때 (단, 완전히 서비스를 내렸다가 올리는 등의 리스크함이 존재함, 온라인 중에는 불가능하고 최소 몇시간의 서비스 점검을 동반함)
- mysql 의 global transaction id는 optional이지만 Mongodb의 logical session은 필수 설정이다.
- mongodb는 primary가 죽을때 secondary가 Primary가 되면서 write가 죽지 않는다.(그 이유는 Logical session의 존재덕분에)
- 샤딩 클러스터에서는 Logical session을 각각을 클렌징할 수 없고 config servers에서 클렌징한다.
- 샤딩 클러스터의 구성은 레플리카셋보다 많은 구성이 필요하다. 최소 3배? 하지만 나중에 서비스가 커져서 그때 옮기는 거보다 원래부터 샤딩으로 구성하는 것이 좋을 수도
- mongo db는 memory 특화로 redis,memcached 대체가능하다. 단, 상대적으로 느리긴함 -> mysql+redis => mongo가 대체 가능함
- node.js에서는 moongoose 사용하지 마라.
- 몽고db의 레플리카 디스크가 다 차면 레플리카를 추가해서 해결하고 그 과정에서 리밸런싱 청크 마이그레이션이 생길수 밖에 없는데 이게 너무 느리다. 
   - 따라서 사용률이 50프로가 넘으면 리밸런싱을 시작하는 것 추천
   - 또는 샤드를 추가하는 것이 부담이 된다면 디스크의 양을 증설하는 방법도 있을 것이다.
- mongo db의 스토리지 엔진은 wired tiger를 그냥 사용해라.
- 전체 Index가 아닌 patial index를 사용해라
- buffer pool의 사이즈는 절대 건드리지말고 그대로 써라.
- 몽고4.4 이후로 세컨더리에서 쿼리 레이턴시가 없는게 아니라 최소화하고 만약 데이터를 쓰고 바로 읽어야 된다면 무조건 primary에서 읽어야한다.
- 웬만하면 _id를 샤딩키로 잡지 마라. _id를 조건으로 조회를 하는 경우는 없을것이다. 
- ReadConcern은 개발자가 막게 설정해서 써야한다... 장애시 dba 할 수 있는게 없다..?
- 성능에 문제없이 paging query를 사용하려면 샤딩 클러스터에서 쓰면안된다.
   - 
- writeQuery는 샤드당 1만개가 안넘도록
   - 서버 하나가 10만개를 처리할 수 있는지 중요하지 않다. 
   - 복제 지연이 안생길수 있느냐? 보장할 수 없기 때문에 20만개가 하다면 샤드를 20개로 구성하라. 샤드당 3대해서 70~80대가 들어가야한다. 