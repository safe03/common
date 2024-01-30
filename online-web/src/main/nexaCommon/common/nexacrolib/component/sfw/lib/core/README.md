# Module's Struture

 +---------------------------------------------------------------------
 |    
 |    +-------------------+  +---------+  +----------+  +------------+
 |    |                   |  |         |  |          |  |            |
 |    |   Repositories    |  |  Batch  |  | Graphics |  |            |
 |    |                   |  |         |  |          |  |            |
 |    +-------------------+  +---------+  +----------+  |            |
 |                                                      |  Projects  |
 |    +-------------------+  +-----------------------+  |            |
 |    |                   |  |                       |  |            |
 |    |  Dataset Manager  |  |      Open Library     |  |            |
 |    |                   |  |                       |  |            |
 |    +-------------------+  +-----------------------+  +------------+
 |    
 |    +-------------------+  +-----------------------+  +------------+
 |    |                   |  |                       |  |            |
 |    |      Layouts      |  |      Core Library     |  |   Router   |
 |    |                   |  |                       |  |            |
 |    +-------------------+  +-----------------------+  +------------+
 |    
 |    +----------------------------------------------+  +------------+
 |    |                                              |  |            |
 |    |                                              |  |  Services  |
 |    |           Transaction Manager                |  |            |
 |    |                                              |  +------------+
 |    |                                              | 
 |    +----------------------------------------------+ 
 |    
 +---------------------------------------------------------------------

 1.  Projects           : `프로젝트`와 관련 된 정보가 등록 된 읽기 전용 개체
 2.  Repositories       : `내부/외부 저장소`와 관련 된 읽기/쓰기용 지원 개체
 3.  Batch              : `백그라운드 프로세스`와 관련 된 내부 처리 개체
 4.  Graphics           : svg/canvas와 관련 된 `그래픽` 처리용 개체
 5.  DatasetManager     : 데이터셋 설정 및 저장과 관련 된 `데이터셋 관리 개체`
 6.  OpenLibrary        : `외부 라이브러리`와 관련 된 지원 개체
 7.  CoreLibrary        : `내부 라이브러리`와 관련 된 지원 개체
 8.  Layouts            : `화면 및 팝업`과 관련 된 전용 지원 개체
 9.  Router             : 경로 처리를 위한 고유 `지원 개체`
 10. Services           : 전용 `서비스`(ftp/file)과 관련 된 지원 개체
 11. TransactionManager : 서버 `통신`을 위한 통신 관리 개체


## Module's Dependencies Tree


| |                       < Module's Dependencies Tree >
| |  
| |    
| |  
| |         [ Projects ]                [ OpenLibrary ]    [ Graphics ]
| |              |                             |                 |
| |              V                             V                 |
| |       [ Repositories ] -----------> [ CoreLibrary ] <--------+
| |              |                             |
| |              |                             |
| |              +-------------------+---------+-------> [ Routers ]    
| |              |                   |         |              |
| |              V                   |         |              |
| |      [ DatasetManager ]      [ Batch ]     |         [ Layouts ]
| |              |                   |         V
| |              V                   |     [ Socket ]
| |     [ TransactionManager ] <-----+         |
| |              |                             |
| |              |                             |
| |              +------------> [ Services ] <-+
| |  
| |  
| +=========================================================================
+---------------------------------------------------------------------------




# Module Document


## Projects 

프로젝트정보와 연관되어 있는 고유 설정 정보들과 
그 정보들의 리소스 정보를 확인할수 있는 프로젝트의 메타 객체(읽기 전용)

@{Projects}는 하나 이상의 @{Project}를 가지며 각 @{Project}는 고유한 공간에 저장 됩니다.


## Repositories 

저장소의 관리 및 저장소 생성과 관련하여 등록/수정/삭제 가능한 메모리 공간을 관리하는 객체

 [ Layout Structural ]
           |
           + loc : 내부 저장공간 처리를 위한 공간
           |
           + mem : 메모리 저장공간 처리를 위한 공간
           |
           + svr : 서버 저장공간 처리를 위한 공간

## Batch

백프로세싱 처리를 위한 작업(job)관리와 job 기간에 따른 스케쥴링 처리를 관리하는 객체

	[ Layout Structural ]
           |
           +- Jobs { Object }
           |
           +- JobFactory { Function }
           |
           +- Run { Function }

## Graphics

넥사크로에서 지원하는 [svg]기반의 컴포넌트 처리나 웹 상의 [d3.js]와 같은 그래픽 처리를 추상화한 객체

@TODO 그래픽 확인 후 작업 예정

## DatasetManager

데이터셋의 설정 작업 및 데이터 셋 고유 정보를 등록 관리하는 객체

	[ Layout Structural ]
           |
           +- Settings { Repository }
           |
           +- Aliases { Repository }
           |
           +- Dataset { Repository }

## OpenLibrary

open source 기반의 라이브러리가 등록 된 객체 ( 현재 Form을 브릿지로 두고 사용하고 있다)

## CoreLibrary

not opened source 기반의 라이브러리가 등록 된 객체

## Layouts

[Frame]기반의 구조와 데이터 처리를 위한 구조적으로 레이아웃을 정리한 객체

## Router

경로 라우팅과 메시지 라우팅에서부터 각 포워딩 처리까지 담당하는 객체

## TransactionManager

서버와의 데이터를 통합하고 [ Send/Receive ]를 관리하는 객체


  [ Layout Structural ]
           |
           + Settings {Object}
           |
           + AccessObject {Object}
           |
           + TransactionFactory {Object}
           |        |
           |        + CreateTransaction {Function}
           |        |
           |        - TranasctionBuilder {Object}
           |
           + Transactions {Array}




   [ Transaction Manager Model ]

      +------TXM------+
      |       |       |
      |       |       |
      |       |   i  <-- Settings
      |       |       |
      |       |       |
      |       |   o  --> Transaction
      |       |       |
      |       |       |
      |       |   i  <-- Repositories
      |       |       |
      |       |       |
      |       |   i  <-- DatasetManager
      |       |       |
      |       |       |
      |       |   i  <-- Batch
      |       |       |
      |       |       |
      +-------+-------+


  [ Sudo TransactionManager Structural ]

  <TransactionManager version="${FrameworkVersion}">

      <Settings description="property information related to transaction processing">
     
          <Status default="P" value="Pending[P] | Running[R] | Declined[D]">
             Shared Transaction Status [avoid dead blocking]
          </Status>
     
          <BaseUrl default="none" value="http://127.0.0.1:8080/aplus or svcUrl::">
              base http connection url or urn
          </BaseUrl>

          <Socket default="none">

              <connect default="ws:localhost:8080/aplus/sfw/biz/cmm/socket.do">
                  Connect to a server that uses Message
              </connect>

          </Socket>

          <Broker default="none">

              <connect default="ws:localhost:8080/aplus/sfw/biz/cmm/ws.do">
                  Connect to a server that uses Message Queuing.
              </connect>

              <listen default="/receive/sfw/biz/cmm/ws.do">
                  Message queues are used to receive messages from the server.
              </listen>

              <send default="/send/sfw/biz/cmm/ws.do">
                  Message queues are used to transfer messages from the server.
              </send>

          </Broker>

          <ConnectionCheck And Repeat default="false" value="true | false" period="1s">
        		whether to connect periodically to prevent the server from being disconnected
          <ConnectionCheck>

          <Logging default="false">
             Transaction MetaConfig Reset Check And Status Check Loggin
          </Logging>
     
      </Settings>


      <Transaction>

          <Header description="property information related to transaction element{s}">
          
              <id> ID </id>

              <serviceId> UNIQUE ID </serviceId>

              <url default="Settings.BaseUrl"> connection url </url>

              <type default="nexacro"> nexacro | json | xml </type>

              <data aliase="params"> nexacro global parameter(s) | formatted data </data>

              <async default="false"> true | false </async>

              <header> header info(K=V) </header>

              <repeat> 
                  <event default="no"> no | failed | all </event>
                  <period default="5s"> timeing [s(econd), m(inute), h(our), d(ay)]</period>
                  <repeat default="1">1</period>
              </repeat>

              <handler aliase="callback" default="none" desc="on success or error handler">
				<onsuccess> only use when transaction status a success </onsuccess>
				<onfailed> only use when transaction status a failed </onfailed>
			  </handler>
			  
			  <onReady> on ready tranaction trigging event </onReady>
			  <onClosed> on closed tranaction trigging event </onClosed>

              <data-type default="XML"> XML[0] | BIN[1] | SSV[2] <data-type>

              <dataset-type default="U"> Tranasction Dataset Type(Update[U]|All[A]) </dataset-type>

              <sql> 
                  <type> SQL[S] | MAPPER[M] | PROCEDURE[P] </type>
                  <query> this tag is only support SQL[S] type <query>
                  <mapper> this tag is only support MAPPER[M] type <mapper>
                  <procedure> this tag is only support PROCEDURE[P] type <procedure>
                  - <insert default="BasicSupporter"> use insert type mapping </insert>
                  - <update default="BasicSupporter"> use update type mapping </update>
                  - <delete default="BasicSupporter"> use delete type mapping </delete>
                  - <normal default="BasicSupporter"> use normal type mapping </normal>
              </sql>
			  
			  <validate type="object" desc="system validate">
				<list>
				  <type aliase="rq">required</type>
				  <type aliase="dt">date</type>
				  <type>fromto</type>
				  <type>range</type>
				  <type aliase="le">max</type>
				  <type aliase="ge">min</type>
				  <type aliase="lt">over</type>
				  <type aliase="gt">under</type>
				  <type aliase="eq">equal</type>
				  <type aliase="neq">notEqual</type>
				  <type aliase="xl">maxLength</type>
				  <type aliase="nl">minLength</type>
				  <type aliase="xb">maxByte</type>
				  <type aliase="nb">minByte</type>
				  <type aliase="dom">domain</type>
				  <type aliase="bn">bizno</type>
				  <type aliase="eml">email</type>
				</list>
			  </validate>
			  
			  <validator type="function">
				Customer Validation Setup Function
			  <validator/>
			  
			  <message>Show Registration Save Message</message>
			  <noask>Show or not show save messages</noask>

              ... Extension this section {}

          </Header>
          
          <Body description="property information related to transaction element{s}">
          
              <dataset> Dataset Name </dataset>

              <params>
                  <key> Value </key> ...
              </params>

              <mode> Transaction Dataset Mode(in|out) </mode>

              <type> Dataset Type ( Update[U] | All[A] ) </type>

              <sql>
                  <type> Server Mapping Type( PROCEDURE[P]|Mapper[M]|SQL[S] ) </type>
                  <query option=true> when SQL Type is SQL, sql query </query>
                  <mapper option=true> when SQL Type is Mapper, sql Mapper id </query>
                  <procedure option=true> when SQL Type is PROCEDURE, sql Procedure id </query>
              </sql>

              <order>Execute Order{Number}</order>

              <join>
                  <dataset> Join Dataset Name(s) </dataset>
                  <on> Join Point Column Name(s) Array in Array </on>
                  <mode> Join Transaction Dataset Mode(in|out) </mode>
              </join>

              <validate desc="System User Validator">
                  <target>
                      <item> Validate Item </item>
                      <message> Validate Message{n} </item>
                  </target> ...
              </validate>

              <validator desc="Function User Validator">
                  Validate Registration( Function )
              </validator>
			  
			  <quiet default="false"> 
				be quiet message [true or false] 
			  </quiet>
			  
			  <execute default="false"> 
			    executable function [true or false] 
			  </execute>
			  
			  <order default="0"> 
				ordering sort number [N]
			  </order>
			  
			  <row>
				<cols optional> Binded Columns[Seperate ','] </cols>
				<expr optional> Binded Expression RegExpr of Nexacro Platform </expr>
			  </row>

              ... Extension this section {}

          </Body>

      </Transaction>
      
  </TransactionManager>



## Transaction Object
      
트랜젝션 처리와 관련 된 고유 객체이며 처리를 위한 추상화 객체

> [ THS, Transaction Header Layout Structural ]
        
        {
            + id : 'Transaction unique id'   ,
            + url : 'Transaction Connect Url' ,
            + socket : 'Registers information for the server's TCP connection.',
            + broker : 'Registers information for TCP connection of a server using a message broker.',
			- url : 'base connection url'
            + type : 'Transaction Data type(XML|JSON|NEXACRO)' ,
            + data : 'Transaction Data(Parameter|ToData)',
			- params : 'ref:data'
            + dataType : 'Nexacro Transaction Data Format Type(XML|BIN|SSV)',
			- type : 'Parameter Request Type(Nexacro|Json|Xml) use Message Converting on Transaction Manager'
            + async : 'Transaction Syncronize(true|false)',
			+ header : 'Transaction Header'
            + repeat : {    event  : 'Active Event Timeing(no|failed|all)',
                                     period : 'Active Event Time Period(ms|s|m|h)'      },
            + handler : 'Transaction Callback Handler(Callback Name{String}|Callback|Function{Function}|Callback Object{Object})',
			- callback : 'ref::handler'
			+ validate : 'do valid check use System Validation'
			+ validator : 'do valid check use User Validation'
			+ lazy : lazy execute function'
			+ promise : 'promise profileing transaction (reject|resolve)'
			+ reuse : 'reusable transaction item(true|false)'
			+ onReady : 'on ready callback function'
			+ onClosed : 'on closable callback function'
			- noask(drifting) : 'service attribute for save message view'
			- message(drifting) : 'service attribute for save message'
            - transactionBody : 'Transaction Body Object',
        }


> [ TBS, Transaction Body Structural ]
        
        { 
            add(Object) : {
                       + dataset : 'Dataset Name or Aliase{String} or Dataset Object{Object}',
                       + params  : {          & 파라미터 객체를 등록한다.
                             "key" : "value"  & [key] 값을 사용하여 값을 등록 합니다. 
                                              & [value]는 {값[Primitive]} 또는 {함수[Function]}로 대체 할 수 있습니다.
                         },
                       + mode : 'Transaction Dataset Mode(in|out)',
                       + type : 'Tranasction Dataset Type(Update[U]|All[A])',
                       + bind(option)      : {
                              "client" : "server" & 클라이언트에서 보내는 파라미터 및 데이터셋 정보를 서버와 연결하도록 하기 위한 바인드 객체
                         },
                       + sql  : {            & 서버 쿼리와 연결하기 위한 처리
                             type : 'query type(PROCEDURE|MAPPER|QUERY|SERVICE)',
                             query(option)     : 'type이 [SQL]일 경우 쿼리를 직접 등록 할 수 있도록 처리(보안성 강화 필요)',
                             mapper(option)    : 'type이 [MAPPER]일 경우 매퍼의 아이디를 등록하여 서버와 연동 처리',
                             procedure(option) : 'type이 [PROCEDURE]일 경우 프로시져의 명칭을 등록하여 서버와 연동 처리',
							 service(option)   : 'type이 [SERVICE]일 경우 원격 전문을 위한 고유 JSON 데이터를 사용하여 서버와 연동 처리',
                             ins(option)       : '입력 모드 데이터셋일 경우 type에 따른 실행 처리',
                             upd(option)       : '수정 모드 데이터셋일 경우 type에 따른 실행 처리',
                             del(option)       : '삭제 모드 데이터셋일 경우 type에 따른 실행 처리',
                             nor(option)       : '일반 모드 데이터셋일 경우 type에 따른 실행 처리',
							 chunk(option)     : 'type이 [SERVICE]일 경우 트랜잭션의 JSON 데이터를 묶을 기준을 제시 (-1|0|n)'
                         }
                       + order : 'Order Number{Number, Number.NativeMaxValue ~ Number.MaxValue} join 시 동작하지 않는다.',
                       + join : {            & Join Dataset Inventory
                             dataset : '조인 데이터셋 명칭 또는 객체 > dataset',
                             on      : '조인 컬럼 명칭{Array} > [ [ col1, col2 ], [ col1, col2 ] ]',
                             mode    : 'Join Transaction Dataset Mode(in|out)',
                             point   : 'Dataset Join Point'
                         }
                       + validate : {         & 기존 등록되어 있는 벨리데이터를 사용하여 벨리데이션을 처리한다.
                             "target" : {     & 벨리데이트를 등록할 타겟을 선택한다.
                                 "type"    : "validate items",
                                 "message" : "validation message",
                             }
                         },
                       + validator : Function(data, params, row) { & 벨리데이터를 직접 등록 한다.
                            return ( true[pass] | false[fail] )
                         },
                       + [Extension] : 확정 시 이곳에 등록
                       -and : 'method chaining add [Method]',
                       -add : 'method chaining and [Method]',
            },
            and(Object) : {
                 add : 'method chaining and grouping [Method]',
            },
            end(Object:build) : {
               lazy : 'lazy executable (true|false)',
                promise : 'promise callable(true|false),
            },
            call(Function) : 'Tranasction Active Call Use For *Erorr Handler'
        }



> [ TBL, Transaction Builder(Bridge) Layout Structural ]
  
     {
          +add : "Regist - Now Transaction Object[R]",
          +and : "Create - New Transaction Object[C]",
          +end : "Exit - Created Transaction Object[E]"
     }
  
  
> [ TPS, Tasking Processing Scenario ]

   s1. [ add -> end ]                      : Single Transaction [ ST ]
   s2. [ add -> add -> end ]               : Single Group Transaction [ SGT ]
   s3. [ add -> end -> add -> end ]        : Multiful Transaction [ MT ]
   s4. [ add -> end -> and -> add -> end ] : Multiful Group Transaction [ MGT ]
   s5. [ socket -> close ]                 : Single Socket Transfer [ SST ]
   s6. [ broker -> close ]                 : Multiful Group Socket Transfer [ MGST ]


## Services

외부로 노출 되어야 하거나 추후 제공 될 예상 기능들을 하나로 묶어 제공하는 객체

# Module's Layout Tree

  [ Layout Structural ]
      |
      + Projects [ Prototype ]
      |    |
      |    + Project : 프로젝트와 관련 된 정보의 묶음
      |    |
      |    \- [Extension] : 확정 시 이곳에 등록
      |
      + Repositories : 저장 공산과 관련 된 정보의 묶음
      |    |
      |    + R{N}[Object] : 저장 공간 확장 시에 {N}의 고유 숫자를 부여되어 고유성을 지닌다.
      |    |    |
      |    |    \- Factory : 저장공간을 처리할 팩토리 객체
      |    |
      |    \- [Extension] : 확정 시 이곳에 등록
      | 
      + Batch
      |    |
      |    + Process[Array] : 배치가 동작할 프로세스들의 배열 (자세한 프로세스 정보는 아래 설명에 따른다.)
      |    |
      |    \- [Extension] : 확정 시 이곳에 등록
      | 
      + OpenLibrary
      |    |
      |    + this[Object] : SFW 고유 유틸을 사용
      |    |
      |    \- [Extension] : 확정 시 이곳에 등록
      |
      + CoreLibrary
      |    |
      |    + this[Object] : SFW 고유 유틸을 사용
      |    |
      |    \- [Extension] : 확정 시 이곳에 등록
      | 
      + Services
      |    |
      |    + Service[Object] : 고유 서비스와 관련 된 함수 또는 객체의 묶음
      |    |
      |    \- [Extension] : 확정 시 이곳에 등록
      |    
      + DatasetManager
      |    |
      |    + Settings[Object] : 데이터 셋 설정 정보
      |    |
      |    + Datasets[Object] : 관리되는 데이터 셋 정보 ( 자세한 설명은 아래 데이터셋 객체 설명에 따른다.)
      |    |
      |    \- [Extension] : 확정 시 이곳에 등록
      |
      + TransactionManager    
      |    |
      |    + Settings[Object] : 트랜잭션 설정 정보
      |    |
      |    + Transaction[Object] : 관리되는 트랜젝션 객체 ( 자세한 설명은 아래 트랜잭션 객체 설명에 따른다.)
      |    |
      |    \- [Extension] : 확정 시 이곳에 등록
      |
      \- [Extension] : 확정 시 이곳에 등록




## Function's

1. Validator ( 검증기 )

검증기는 현재 [ validate ]와 [ validateDataset ] 이 등록 되어 있으며 
추가적으로 검증기를 등록할 경우 검증기의 등록하여 사용하도록 합니다.
검증기는 아래 스펙을 따라 처리 되므로 추가할 경우 아래 스펙을 맞추어 등록할수 있도록 합니다.

검증기의 인자 : ( value, code[, message1[, message2[, message3[, message4 ] ] ] ] )
 - value : {object} - 검증기에서 검증할 값
 - code : {string} - 검증기의 고유한 명칭(예 : required)
 - message(n) : {string} - 검증이 실패할 경우 처리할 메시지

검증기의 반환값 : {boolean} - 검증이 실패할 경우 ( false, 검증 실패 ) 를 반환하며 성공할 경우 ( true, 검증 성공 ) 를 반환합니다.

## Erorr Handler

서버에서 에러 발생 시 처리 되는 에러 객체로써 전송 ID(id)와 데이터 전송 시 사용 되는 수정 카운트(updateCount) 서버상에서 전송 되어오는 정보 데이터가 포함되어 있습니다.

에러 핸들러의 첫번째 인자(Argument) 객체로 바인딩 되며 처리 시 속성값 접근을 사용하여 접근할 수 있습니다.

<Object-Meta-Information>
_uuobj = {
	id          : _setting.id,         //- Manage Unique ID
	serviceId   : _setting.serviceId,  //- Service Transaction ID
	status      : 'PENDING',           //- [ PENDING, READY, RUNNING, COMPLITE, REJECTED, SUCCESS ]
	resolve     : null,                //- Resolve Promise
	reject      : null,                //- Resolve Promise
	reuse       : attr.reuse || false, //- Reusable function
	rows        : [],                  //- Row Save Setting
	object      : this,                //- Transaction Manager Object
	closed      : false,               //- Close Yes or No
	updateCount : {n}                  //- Update Counting
}
<Object-Meta-Information>


### 추가 사항

1. 다중선택 삭제 - 체크박스
	- 선택된 자료 [ @ ]건를 삭제 하시겠습니까?

2. 데이터셋 수정여부 확인 (confirm)
	- 변경된 자료가 있습니다. 조회 시 변경 자료는 초기화 됩니다.\n조회 하시겠습니까?