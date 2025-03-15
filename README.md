# SSIOSK
### 시·청각장애인 친화적 키오스크 - SSAFY 2학기 공통 프로젝트
![logo](https://github.com/DeadBBall/ssiosk/assets/89844277/78d54c4d-c766-48f9-9f86-b617c9386ad8)

## 프로젝트 개요
일상생활에서 많은 불편함을 느끼는 시·청각장애인은 다른 이의 도움 없인 매장에서 주문하는 것조차 힘듭니다.
<br>
SSIOSK는 시각장애인 친화적인 키오스크로, 점자 디스플레이와 음성을 통해 정보를 전달하고 조이스틱과 버튼으로 제어하는 주문 시스템을 개발하여 시각장애인이 혼자서 주문을 할 수 있도록 돕는 서비스입니다.
<br><br><br><br>

## 프로젝트 소개
- 터치 스크린뿐만 아니라 조이스틱 조작을 통해 시·청각장애인들도 쉽게 메뉴를 선택할 수 있습니다.
- 이어폰 연결 시 조이스틱 조작과 메뉴에 대한 설명을 음성으로 안내해주어 이용에 도움을 줍니다.
- 조이스틱 조작 안내와 메뉴에 대한 설명을 점자 디스플레이로 표현하여 더 구체적으로 안내할 수 있습니다.
- 저시력 장애인들을 위하여 글자보다 사진과 아이콘을 사용하고, 색대비를 주어 가독성 좋은 유저 인터페이스를 제공합니다.
- 비장애인들도 편하게 사용할 수 있는 직관적인 유저 인터페이스도 제공합니다.
- 매장의 사장님이 테이블 관리를 하거나 카테고리와 메뉴 추가 및 수정, 삭제를 할 수 있는 관리자 페이지도 존재합니다.
<br><br><br><br>

## 개발 기간
2023.07.04 ~ 2023.08.18
<br><br><br><br>

## 팀 소개
### 팀 로고
![logo-removebg-preview](https://github.com/DeadBBall/ssiosk/assets/89844277/aa155b0e-384c-4d76-9672-07b786c2710b)

<br><br><br><br>

### 팀 개발새발
- 이충혁(IoT): 점자 디스플레이 모듈 HW SW 개발, 라즈베리파이에 플라스크 웹서버 개발, 모듈 응용프로그램 멀티프로세싱 개발
- 김용균(BE): DB 설계, JPA 이용한 API 설계 및 구현, 서버 테스트, CI / CD 인프라 관리
- 손준호(FE): 사용자 페이지 전체(장애인 모드, 비장애인 모드) 레이아웃, CSS 설계 및 구현, 관리자 페이지 레이아웃, CSS 설계 및 구현
- 이상린(IoT): 조이스틱 조작 모듈 HW SW 개발, TTS 응용프로그램 개발, 점자 인코딩 응용프로그램 개발, 키보드 인터럽트 활용 화면 제어 응용프로그램 개발
- ~~은승욱(BE):  API 설계, spring boot 서버 코드 초안 작성, jenkins 와 docker 이용한 CI / CD 인프라 설계 및 구현, 인프라 문서화~~
- ~~신애림(FE): 시각장애인 친화적 UX 설계, 사용자 페이지 (장애인 모드) 설계 및 구현~~
<br><br><br><br>

## 기술스택
<img src="https://img.shields.io/badge/java-007396?style=for-the-badge&logo=java&logoColor=white">
<img src="https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white">
<img src="https://img.shields.io/badge/springdatajpa-6DB33F?style=for-the-badge&logo=springboot&logoColor=white">
<img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">
<img src="https://img.shields.io/badge/html-E34F26?style=for-the-badge&logo=html5&logoColor=white">
<img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white">
<img src="https://img.shields.io/badge/c++-00599C?style=for-the-badge&logo=c%2B%2B&logoColor=white">
<img src="https://img.shields.io/badge/python-3776AB?style=for-the-badge&logo=python&logoColor=white">
<img src="https://img.shields.io/badge/bluetooth-0082FC?style=for-the-badge&logo=bluetooth&logoColor=white">
<img src="https://img.shields.io/badge/flask-000000?style=for-the-badge&logo=flask&logoColor=white">
<img src="https://img.shields.io/badge/googlecloud-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white">
<img src="https://img.shields.io/badge/Raspberry Pi-A22846?style=for-the-badge&logo=Raspberry Pi&logoColor=white">
<img src="https://img.shields.io/badge/STM32CUBE-03234B?style=for-the-badge&logo=STMicroelectronics&logoColor=white">
<img src="https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white">
<img src="https://img.shields.io/badge/jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white">
<img src="https://img.shields.io/badge/nginx-009639?style=for-the-badge&logo=nginx&logoColor=white">
<img src="https://img.shields.io/badge/gitlab-FC6D26?style=for-the-badge&logo=gitlab&logoColor=white">
<br><br><br><br>

## 개발환경

- VS Code : 1.80.2
- IntelliJ : Ultimate 2023.1.3
- JVM : 17.0.8
- Node.js : 16.14.2
- SERVER : AWS EC2 Ubuntu 20.04.3 LTS
- DB : mysql 8.0.34
- StmCubeIDE : 1.13.1
- ArduinoIDE : 2.1.1
<br><br><br><br>

## 인프라
![아키텍처](https://github.com/DeadBBall/ssiosk/assets/89844277/b4385cc4-30b9-4a41-9d1a-0d221ff8bfc6)
<br><br><br><br>

## ERD
![image](https://github.com/DeadBBall/ssiosk/assets/89844277/a6738274-96cb-4098-aa4c-0ab5ffeed100)
<br><br><br><br>

## 배포 주소
~~https://i9a201.p.ssafy.io~~
<br><br><br><br>

## 주요 기능 소개

### 0. 초기 설정

#### 사장님은 키오스크에서 최초 실행 시에 해당 테이블이 몇 번 테이블인지 매칭해주어야 합니다.
<br>

![image-8](https://github.com/DeadBBall/ssiosk/assets/89844277/04310eed-7caa-43cf-9a3e-8835113af618)
<br><br>

### 1. 조이스틱 조작
#### 조이스틱만으로 메뉴를 선택하고 수량을 변경하여 주문이 가능합니다.
<br><br>

![rn_image_picker_lib_temp_1ceb4df9-3ffa-473b-b03b-aabba7437338](https://github.com/DeadBBall/ssiosk/assets/89844277/09157224-8b7b-405b-b734-28985cbebece)
<br><br><br><br>


### 2. TTS 음성 안내
#### 이어폰 연결 시 조이스틱 조작 방법과 메뉴에 대한 안내를 음성으로 들을 수 있습니다.
<br><br>
https://github.com/DeadBBall/ssiosk/blob/main/presentation/output.wav
<br><br><br><br>


### 3. 점자 디스플레이
#### 조이스틱 조작 방법과 메뉴에 대한 안내를 점자 디스플레이로 확인 가능하고, 버튼을 통해 이전과 다음 점자 출력이 가능합니다.
<br><br>

![rn_image_picker_lib_temp_e7ffaadf-c007-4736-802e-b61dc22ba75f](https://github.com/DeadBBall/ssiosk/assets/89844277/58b6d0df-9681-4aa8-a666-200e3f4d4f1a)

<br><br><br><br>

### 4. 저시력 장애인 UI
#### 색대비가 확실하고 가독성 좋은 유저 인터페이스를 제공합니다.
<br><br>

#### - 기본 화면
![image (1)](https://github.com/DeadBBall/ssiosk/assets/89844277/de5cb08b-7305-4fa3-9ef4-1641a27673ae)

<br><br>

#### - 메뉴 선택
![image-1](https://github.com/DeadBBall/ssiosk/assets/89844277/9481745e-f8d1-4f7b-9c5f-b926dd0f8a85)
<br><br>

#### - 주문하기
![image-2](https://github.com/DeadBBall/ssiosk/assets/89844277/26ce0348-592f-427b-b557-7952af2bcf02)

<br><br><br><br>

### 5. 비장애인 UI
#### 비장애인도 편하게 이용할 수 있는 유저 인터페이스를 제공합니다.
<br><br>

#### - 기본 화면
![image-3](https://github.com/DeadBBall/ssiosk/assets/89844277/c586cc3e-369c-42ce-b7f3-4ba0005dbe7a)

<br><br>

#### - 메뉴 선택
![image-4](https://github.com/DeadBBall/ssiosk/assets/89844277/047442e8-7cde-4a97-ab5f-a578d164ec83)

<br><br>

#### - 주문하기
![image-5](https://github.com/DeadBBall/ssiosk/assets/89844277/8c29c51d-8229-4123-812d-a797bc349684)

<br><br>

#### - 주문 완료 후
![image-6](https://github.com/DeadBBall/ssiosk/assets/89844277/900fbd06-8893-49ad-b8dd-e124fbc72fee)

<br><br>

#### - 주문 내역
![image-7](https://github.com/DeadBBall/ssiosk/assets/89844277/a06fb865-7ba7-4fcc-940e-d873903b4c27)

<br><br><br><br>

### 6. 관리자 페이지
#### 테이블 관리 및 메뉴, 카테고리 추가 수정 삭제가 가능한 관리자 페이지를 제공합니다.
<br><br>

#### - 로그인 화면
![image-9](https://github.com/DeadBBall/ssiosk/assets/89844277/9db1ccdb-f0c6-44db-b9a0-5de90aeb5629)

<br><br>

#### - 테이블 페이지
![image-10](https://github.com/DeadBBall/ssiosk/assets/89844277/4f91e19b-cc96-4bd2-9bf3-92a8da2ead5a)

<br><br>

#### - 테이블 선택
![image-11](https://github.com/DeadBBall/ssiosk/assets/89844277/d6d03098-f1b4-45fb-81ab-7ae2f8dd82a3)

<br><br>

#### - 관리 페이지
![image-12](https://github.com/DeadBBall/ssiosk/assets/89844277/4f663187-a0b6-4195-9a33-bb4670981098)

<br><br>

#### - 메뉴 수정, 삭제
![image-13](https://github.com/DeadBBall/ssiosk/assets/89844277/1a17870c-38f7-444b-a204-601bbd1a36b8)

<br><br>

#### - 카테고리 추가 및 수정, 삭제
![image-14](https://github.com/DeadBBall/ssiosk/assets/89844277/7a4dfe7e-1baf-48f3-81dd-633392c3ca69)

<br><br>

#### - 메뉴 추가
![image-15](https://github.com/DeadBBall/ssiosk/assets/89844277/a260785c-b44a-4de2-bdf0-d98b0c768d27)

<br><br><br><br>

### 7. 에러 페이지
![Animation (1)](https://github.com/DeadBBall/ssiosk/assets/89844277/0a63a2f2-95d3-4863-8d3e-e0a8d2d8102d)
