#include <BleKeyboard.h>

BleKeyboard bleKeyboard;

const int SW_pin = 5;
const int X_pin = 13;
const int Y_pin = 12;

const int BTNTIME = 1000; // 1초 안에 눌러야 함
const int BTN_CONTINUE_TIME = 300; // 0.3초안에 눌러야 연속 버튼 으로 인식

void setup() {
  // put your setup code here, to run once:
  //pinMode(SW_pin,INPUT);
  //digitalWrite(SW_pin,HIGH);
  //Serial.begin(9600);

  Serial.begin(9600);
  Serial.println("Starting BLE work!");
  bleKeyboard.begin();
}

int x_value;
int y_value;
int z_value;

int number=0;
int z_count=0;
unsigned long lastTime_long =0; // 누른 마지막 시간
unsigned long lastTime_short =0; // 뗀 마지막 시간
int flag_push=0; // 눌렀을 때 1, 뗐을 떄 0
int flag_8=0; // 길게 눌리는 이벤트가 발생 했는지
/*
serial로 보내기
  Serial.print("\nX: ");
  Serial.print(analogRead(X_pin));
  Serial.print("\nY: ");
  Serial.print(analogRead(Y_pin));
  Serial.print("\nZ: ");
  Serial.print(digitalRead(SW_pin));
*/
void loop() {
  // put your main code here, to run repeatedly:
  if(bleKeyboard.isConnected()) {

    x_value = analogRead(X_pin);
    y_value = analogRead(Y_pin);
    z_value = analogRead(SW_pin);

    if (x_value >= 1890 && x_value<=2050 &&
    y_value >= 1890 && y_value<=2050)
    {
      number=0;
    }
    if (y_value==4095&&number!=8)
    {
      number=8;
      //Serial.println(1);
      bleKeyboard.write('8');
    }
    if (y_value==0&&number!=2)
    {
      number=2;
      //Serial.println(2);
      bleKeyboard.write('2');
    }
    if (x_value==4095&&number!=4)
    {
      number=4;
      //Serial.println(3);
      bleKeyboard.write('4');
    }
    if (x_value==0&&number!=6)
    {
      number=6;
      //Serial.println(4);
      bleKeyboard.write('6');
    }

    unsigned long currentTime = millis();
    if(z_value == 0)
    {
      if(flag_push == 0)
      {
        flag_push = 1;
        lastTime_long = currentTime;
        lastTime_short = currentTime;

        // 연속으로 버튼을 눌러야 되는 시간 미만에 입력이 들어오면 z_count++
        if (currentTime - lastTime_short < BTN_CONTINUE_TIME)
        {
          Serial.println("연속버튼누름");
          z_count++;
        }
      }
      else
      {
        if (currentTime - lastTime_long > BTNTIME && flag_8 == 0)
        {
          // 모드 변경
          number=9;
          flag_8 = 1;
          //Serial.println(8);
          bleKeyboard.write('9');
          // 길게 누르기 였으니 z_count 초기화
          z_count = 0;
        }       
      }
    }

    if(z_value != 0)
    {
      // z_count값이 있으면 출력
      if(currentTime - lastTime_short > BTN_CONTINUE_TIME && z_count > 0)
        {
          if(z_count >= 3)
          {
            number=1;
            //Serial.println(7);
            bleKeyboard.write('1');
          }
          else
          {
            //number=4 + z_count;
            //Serial.println(number);
            //bleKeyboard.write(KEY_NUM_?);

            // 5,6일 때 사용했엇다

            if (z_count==1) bleKeyboard.write('5');
            else if (z_count==2)  bleKeyboard.write('3');
          }
          z_count = 0;
        }


      // reset
      flag_push= 0;
      flag_8 = 0;
    }

    delay(30);

  }
}