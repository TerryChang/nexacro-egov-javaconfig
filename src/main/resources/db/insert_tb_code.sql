insert into TB_CODEGROUP (GROUP_CD, GROUP_NM, USE_FG, CREATE_DT, CREATE_USER, GROUP_DESC) values('10000', '화면연동', '1', NOW(), 'test', '화면을 연동하는 방식을 결정');
insert into TB_CODEGROUP (GROUP_CD, GROUP_NM, USE_FG, CREATE_DT, CREATE_USER, GROUP_DESC) values('20000', '화면타입', '1', NOW(), 'test', '화면의 타입을 정의');
insert into TB_CODEGROUP (GROUP_CD, GROUP_NM, USE_FG, CREATE_DT, CREATE_USER, GROUP_DESC) values('30000', '메뉴오픈', '1', NOW(), 'test', '메뉴를 오픈하는 방식을 결정');
insert into TB_CODEGROUP (GROUP_CD, GROUP_NM, USE_FG, CREATE_DT, CREATE_USER, GROUP_DESC) values('40000', '화면그룹', '1', NOW(), 'test', '화면의 기능별 그룹');
insert into TB_CODEGROUP (GROUP_CD, GROUP_NM, USE_FG, CREATE_DT, CREATE_USER, GROUP_DESC) values('50000', '메뉴상태', '1', NOW(), 'test', '메뉴의 상태를 결정');

insert into TB_CODE (CODE_CD, GROUP_CD, CODE_NM, CODE_DESC, CODE_GBN, CODE_SEQ, USE_FG, CREATE_DT, CREATE_USER) values('FORM', '10000', '일반화면', '일반적인 화면으로 연동','', 1, '1', NOW(), 'test');
insert into TB_CODE (CODE_CD, GROUP_CD, CODE_NM, CODE_DESC, CODE_GBN, CODE_SEQ, USE_FG, CREATE_DT, CREATE_USER) values('LINK', '10000', '웹페이지', '웹페이지 연동','', 2, '1', NOW(), 'test');
insert into TB_CODE (CODE_CD, GROUP_CD, CODE_NM, CODE_DESC, CODE_GBN, CODE_SEQ, USE_FG, CREATE_DT, CREATE_USER) values('EXEC', '10000', '외부연동', '외부모듈의 실행으로 연동','', 3, '1', NOW(), 'test');
