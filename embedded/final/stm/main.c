/* USER CODE BEGIN Header */
/*
 * 1. ?��충혁 (2023.07.27)
 * 2. solenoid_device/main.c
 * - 기능 : stm보드�???? ?��?��?��?��?�� 모터 ?��?��
 * - ?��?�� : rpi?��?�� uart?��?��?���???? ?��코딩?�� ?��?�� data 받아?�� 처리
 * 3. ?��?�� 목록
 */
/* USER CODE END Header */
/* Includes ------------------------------------------------------------------*/
#include "main.h"
#include "usart.h"
#include "gpio.h"

/* Private includes ----------------------------------------------------------*/
/* USER CODE BEGIN Includes */

/* USER CODE END Includes */

/* Private typedef -----------------------------------------------------------*/
/* USER CODE BEGIN PTD */

/* USER CODE END PTD */

/* Private define ------------------------------------------------------------*/
/* USER CODE BEGIN PD */
enum STATE_VALUE{
	INIT = 0,
	BRAILLE,
	EXIT,
	TROUBLE,
};

enum DEVICE_VALUE{
	NONE = 0,
	RPI,
};
/* USER CODE END PD */

/* Private macro -------------------------------------------------------------*/
/* USER CODE BEGIN PM */

/* USER CODE END PM */

/* Private variables ---------------------------------------------------------*/

/* USER CODE BEGIN PV */
uint8_t buf[150] = "\0";
int recieve_flag = 0;
int clear_val = 0;
uint32_t pre_time = 0;
int start_flag = 0;

// after dynamic memory
uint8_t braille_data[1000][10];
int braille_data_size = 0;
int braille_output_index = 0;

int buf_cnt = 0;
uint8_t key_value;
/* USER CODE END PV */

/* Private function prototypes -----------------------------------------------*/
void SystemClock_Config(void);
/* USER CODE BEGIN PFP */

int Init_func(int *stm_state)
{
	if(recieve_flag == 0)
	{
		return 0;
	}

	if(strcmp(buf, "<pi/init>") == 0)
	{
		printf("<stm/init/ACK>\r\n");
		*stm_state = BRAILLE;
	}
	else
	{
		printf("<stm/init/NACK>\r\n");
	}
	recieve_flag = 0;
	buf_cnt = 0;
	start_flag = 1;
	return 0;
}

int Braille_func(int *stm_state)
{
	uint8_t buf_cpy[20];

	const char front_std_str[20] = "<pi/braille/";
	const int front_std_str_size = strlen(front_std_str);
	const int braille_size = 7;

	static int start_flag = 1;



	/*
	 * uint8_t braille_data[1000][10];
int braille_data_size = 0;
	 */

	if(recieve_flag == 0)
	{
		return 0;
	}

	if(start_flag == 1)
	{
		start_flag = 0;
		braille_data_size = 0;
		braille_output_index = 0;

		// To Do : 	optimization
		memset(braille_data, 0, sizeof(braille_data));
	}

	memset(buf_cpy, 0, sizeof(buf_cpy));
	strncpy(buf_cpy, buf, front_std_str_size);


	if(strcmp(buf, "<pi/braille/end>") == 0)
	{
		printf("<stm/braille/ACK>\r\n");
		buf[0] = '\0';
		start_flag = 1;
		clear_val = 1;
	}

	else if(strcmp(buf_cpy, "<pi/braille/") == 0)
	{
		// temp added braille_data_size.
		// because of, wrong protocol
		int braille_data_size_temp = 0;


		while(1)
		{
			uint8_t slash_check = buf[front_std_str_size + braille_data_size_temp * braille_size - 1];
			if(slash_check == '>')
			{
				break;
			}
			else if(slash_check != '/')
			{
				printf("<stm/braille/NACK>\r\n");
				braille_data_size_temp = 0;
				break;
			}
			strncpy(braille_data[braille_data_size + braille_data_size_temp], buf + front_std_str_size + braille_data_size_temp * braille_size, braille_size);
			braille_data_size_temp++;
		}

		braille_data_size += braille_data_size_temp;
		//braille_data_size++;

		printf("<stm/braille/ACK>\r\n");
		buf[0] = '\0';
	}
	else if(strcmp(buf, "<pi/exit>") == 0)
	{
		*stm_state = EXIT;
	}
	else
	{
		printf("<stm/braille/NACK>\r\n");
	}

	recieve_flag = 0;
	buf_cnt = 0;
	return 0;
}

int Exit_func(int *stm_state)
{

	printf("<stm/exit/ACK>\r\n");

	//dummy
	int a=0;
	while(1)
	{
		a++;
	}
	return 0;
}

int Error_func()
{

	return 0;
}

const int karno[8][3] = { {0,0,0}, {0,0,1}, {0,1,1}, {0,1,0}
,{1, 1, 0}, {1, 1, 1}, {1, 0, 1}, {1, 0, 0}
};


int print_braille_func()
{

	static int i = 0;
	static int check[8] = {0,};

	HAL_GPIO_WritePin(OE_pin_GPIO_Port, OE_pin_Pin, GPIO_PIN_RESET);

	if(clear_val == 1)
	{
		clear_val = 0;
		pre_time = HAL_GetTick();
		i = 0;
		memset(check, 0, sizeof(check));

		HAL_GPIO_WritePin(USR_SIG1_GPIO_Port, USR_SIG1_Pin, karno[7][0]);
		HAL_GPIO_WritePin(USR_SIG2_GPIO_Port, USR_SIG2_Pin, karno[7][1]);
		HAL_GPIO_WritePin(USR_SIG3_GPIO_Port, USR_SIG3_Pin, karno[7][2]);

		HAL_GPIO_WritePin(USR_DATA1_GPIO_Port, USR_DATA1_Pin, GPIO_PIN_RESET);
		HAL_GPIO_WritePin(USR_DATA2_GPIO_Port, USR_DATA2_Pin, GPIO_PIN_RESET);
		HAL_GPIO_WritePin(USR_DATA3_GPIO_Port, USR_DATA3_Pin, GPIO_PIN_RESET);
		HAL_GPIO_WritePin(USR_DATA4_GPIO_Port, USR_DATA4_Pin, GPIO_PIN_RESET);
		HAL_GPIO_WritePin(USR_DATA5_GPIO_Port, USR_DATA5_Pin, GPIO_PIN_RESET);
		HAL_GPIO_WritePin(USR_DATA6_GPIO_Port, USR_DATA6_Pin, GPIO_PIN_RESET);

		for(int j=0; j<8; j++)
		{
			HAL_Delay(10);
			HAL_GPIO_WritePin(USR_SIG1_GPIO_Port, USR_SIG1_Pin, karno[j][0]);
			HAL_GPIO_WritePin(USR_SIG2_GPIO_Port, USR_SIG2_Pin, karno[j][1]);
			HAL_GPIO_WritePin(USR_SIG3_GPIO_Port, USR_SIG3_Pin, karno[j][2]);
		}

		HAL_Delay(10);
	}

	if(start_flag == 0)
		return 0;



	i = (HAL_GetTick() - pre_time) / 500;

	if(i > 8)
	{

		for(int j=0; j<8; j++)
		{
			HAL_GPIO_WritePin(USR_DATA1_GPIO_Port, USR_DATA1_Pin, GPIO_PIN_RESET);
			HAL_GPIO_WritePin(USR_DATA2_GPIO_Port, USR_DATA2_Pin, GPIO_PIN_RESET);
			HAL_GPIO_WritePin(USR_DATA3_GPIO_Port, USR_DATA3_Pin, GPIO_PIN_RESET);
			HAL_GPIO_WritePin(USR_DATA4_GPIO_Port, USR_DATA4_Pin, GPIO_PIN_RESET);
			HAL_GPIO_WritePin(USR_DATA5_GPIO_Port, USR_DATA5_Pin, GPIO_PIN_RESET);
			HAL_GPIO_WritePin(USR_DATA6_GPIO_Port, USR_DATA6_Pin, GPIO_PIN_RESET);

			HAL_GPIO_WritePin(USR_SIG1_GPIO_Port, USR_SIG1_Pin, karno[j][0]);
			HAL_GPIO_WritePin(USR_SIG2_GPIO_Port, USR_SIG2_Pin, karno[j][1]);
			HAL_GPIO_WritePin(USR_SIG3_GPIO_Port, USR_SIG3_Pin, karno[j][2]);
		}
		return 0;
	}

	if(check[i] == 0)
	{
		check[i] = 1;

		HAL_GPIO_WritePin(USR_DATA1_GPIO_Port, USR_DATA1_Pin, GPIO_PIN_RESET);

		//USR_DATA1_GPIO_Port->BSRR = (uint32_t)USR_DATA1_Pin << 16U;
		HAL_GPIO_WritePin(USR_DATA2_GPIO_Port, USR_DATA2_Pin, GPIO_PIN_RESET);
		HAL_GPIO_WritePin(USR_DATA3_GPIO_Port, USR_DATA3_Pin, GPIO_PIN_RESET);

		HAL_GPIO_WritePin(USR_DATA4_GPIO_Port, USR_DATA4_Pin, GPIO_PIN_RESET);
		HAL_GPIO_WritePin(USR_DATA5_GPIO_Port, USR_DATA5_Pin, GPIO_PIN_RESET);
		HAL_GPIO_WritePin(USR_DATA6_GPIO_Port, USR_DATA6_Pin, GPIO_PIN_RESET);


		HAL_GPIO_WritePin(USR_SIG1_GPIO_Port, USR_SIG1_Pin, karno[(i + 6) % 8][0]);
		HAL_GPIO_WritePin(USR_SIG2_GPIO_Port, USR_SIG2_Pin, karno[(i + 6) % 8][1]);
		HAL_GPIO_WritePin(USR_SIG3_GPIO_Port, USR_SIG3_Pin, karno[(i + 6) % 8][2]);

		HAL_GPIO_WritePin(USR_SIG1_GPIO_Port, USR_SIG1_Pin, karno[(i + 7) % 8][0]);
		HAL_GPIO_WritePin(USR_SIG2_GPIO_Port, USR_SIG2_Pin, karno[(i + 7) % 8][1]);
		HAL_GPIO_WritePin(USR_SIG3_GPIO_Port, USR_SIG3_Pin, karno[(i + 7) % 8][2]);


		if(braille_data[braille_output_index + i][0] == '1')
		{
			HAL_GPIO_WritePin(USR_DATA1_GPIO_Port, USR_DATA1_Pin, GPIO_PIN_SET);
		}
		else
		{
			HAL_GPIO_WritePin(USR_DATA1_GPIO_Port, USR_DATA1_Pin, GPIO_PIN_RESET);
		}
		if(braille_data[braille_output_index + i][1] == '1')
		{
			HAL_GPIO_WritePin(USR_DATA2_GPIO_Port, USR_DATA2_Pin, GPIO_PIN_SET);
		}
		else
		{
			HAL_GPIO_WritePin(USR_DATA2_GPIO_Port, USR_DATA2_Pin, GPIO_PIN_RESET);
		}
		if(braille_data[braille_output_index + i][2] == '1')
		{
			HAL_GPIO_WritePin(USR_DATA3_GPIO_Port, USR_DATA3_Pin, GPIO_PIN_SET);
		}
		else
		{
			HAL_GPIO_WritePin(USR_DATA3_GPIO_Port, USR_DATA3_Pin, GPIO_PIN_RESET);
		}
		if(braille_data[braille_output_index + i][3] == '1')
		{
			HAL_GPIO_WritePin(USR_DATA4_GPIO_Port, USR_DATA4_Pin, GPIO_PIN_SET);
		}
		else
		{
			HAL_GPIO_WritePin(USR_DATA4_GPIO_Port, USR_DATA4_Pin, GPIO_PIN_RESET);
		}
		if(braille_data[braille_output_index + i][4] == '1')
		{
			HAL_GPIO_WritePin(USR_DATA5_GPIO_Port, USR_DATA5_Pin, GPIO_PIN_SET);
		}
		else
		{
			HAL_GPIO_WritePin(USR_DATA5_GPIO_Port, USR_DATA5_Pin, GPIO_PIN_RESET);
		}
		if(braille_data[braille_output_index + i][5] == '1')
		{
			HAL_GPIO_WritePin(USR_DATA6_GPIO_Port, USR_DATA6_Pin, GPIO_PIN_SET);
		}
		else
		{
			HAL_GPIO_WritePin(USR_DATA6_GPIO_Port, USR_DATA6_Pin, GPIO_PIN_RESET);
		}



		HAL_GPIO_WritePin(USR_SIG1_GPIO_Port, USR_SIG1_Pin, karno[i][0]);
		HAL_GPIO_WritePin(USR_SIG2_GPIO_Port, USR_SIG2_Pin, karno[i][1]);
		HAL_GPIO_WritePin(USR_SIG3_GPIO_Port, USR_SIG3_Pin, karno[i][2]);

	}

	/*
	 //HAL_Delay(200);

	for(int i=0; i<8; i++)
	{
		HAL_GPIO_WritePin(OE_pin_GPIO_Port, OE_pin_Pin, GPIO_PIN_SET);


		if(braille_data[braille_output_index + i][0] == '1')
		{
			HAL_GPIO_WritePin(USR_DATA1_GPIO_Port, USR_DATA1_Pin, GPIO_PIN_SET);
		}
		else
		{
			HAL_GPIO_WritePin(USR_DATA1_GPIO_Port, USR_DATA1_Pin, GPIO_PIN_RESET);
		}
		if(braille_data[braille_output_index + i][1] == '1')
		{
			HAL_GPIO_WritePin(USR_DATA2_GPIO_Port, USR_DATA2_Pin, GPIO_PIN_SET);
		}
		else
		{
			HAL_GPIO_WritePin(USR_DATA2_GPIO_Port, USR_DATA2_Pin, GPIO_PIN_RESET);
		}
		if(braille_data[braille_output_index + i][2] == '1')
		{
			HAL_GPIO_WritePin(USR_DATA3_GPIO_Port, USR_DATA3_Pin, GPIO_PIN_SET);
		}
		else
		{
			HAL_GPIO_WritePin(USR_DATA3_GPIO_Port, USR_DATA3_Pin, GPIO_PIN_RESET);
		}
		if(braille_data[braille_output_index + i][3] == '1')
		{
			HAL_GPIO_WritePin(USR_DATA4_GPIO_Port, USR_DATA4_Pin, GPIO_PIN_SET);
		}
		else
		{
			HAL_GPIO_WritePin(USR_DATA4_GPIO_Port, USR_DATA4_Pin, GPIO_PIN_RESET);
		}
		if(braille_data[braille_output_index + i][4] == '1')
		{
			HAL_GPIO_WritePin(USR_DATA5_GPIO_Port, USR_DATA5_Pin, GPIO_PIN_SET);
		}
		else
		{
			HAL_GPIO_WritePin(USR_DATA5_GPIO_Port, USR_DATA5_Pin, GPIO_PIN_RESET);
		}
		if(braille_data[braille_output_index + i][5] == '1')
		{
			HAL_GPIO_WritePin(USR_DATA6_GPIO_Port, USR_DATA6_Pin, GPIO_PIN_SET);
		}
		else
		{
			HAL_GPIO_WritePin(USR_DATA6_GPIO_Port, USR_DATA6_Pin, GPIO_PIN_RESET);
		}



		HAL_GPIO_WritePin(USR_SIG1_GPIO_Port, USR_SIG1_Pin, karno[i][0]);
		HAL_GPIO_WritePin(USR_SIG2_GPIO_Port, USR_SIG2_Pin, karno[i][1]);
		HAL_GPIO_WritePin(USR_SIG3_GPIO_Port, USR_SIG3_Pin, karno[i][2]);

		HAL_GPIO_WritePin(OE_pin_GPIO_Port, OE_pin_Pin, GPIO_PIN_RESET);
		HAL_Delay(100);
	}

	*/
	return 0;
}

/* USER CODE END PFP */

/* Private user code ---------------------------------------------------------*/
/* USER CODE BEGIN 0 */
int _read(int file, char *ptr, int len){
  HAL_UART_Receive(&huart2, (uint8_t*)ptr, 1 , 0xFFFF);

  //HAL_UART_Transmit(&huart2, (uint8_t*)ptr, 1, 100);
  return 1;
}
int _write(int file, char *ptr, int len){
  HAL_UART_Transmit(&huart2, (uint8_t*)ptr, len, 100);
  return len;
}
/* USER CODE END 0 */

/**
  * @brief  The application entry point.
  * @retval int
  */
int main(void)
{
  /* USER CODE BEGIN 1 */

  /* USER CODE END 1 */

  /* MCU Configuration--------------------------------------------------------*/

  /* Reset of all peripherals, Initializes the Flash interface and the Systick. */
  HAL_Init();

  /* USER CODE BEGIN Init */
  int stm_state = INIT;
  /* USER CODE END Init */

  /* Configure the system clock */
  SystemClock_Config();

  /* USER CODE BEGIN SysInit */

  /* USER CODE END SysInit */

  /* Initialize all configured peripherals */
  MX_GPIO_Init();
  MX_USART2_UART_Init();
  /* USER CODE BEGIN 2 */

  int flag1 = 0;
  int flag2 = 0;

  HAL_UART_Receive_IT(&huart2, buf, 1);

  print_braille_func();
  /* USER CODE END 2 */

  /* Infinite loop */
  /* USER CODE BEGIN WHILE */
  while (1)
  {

	  switch(stm_state)
	  {
	  case INIT:
		  Init_func(&stm_state);
		  break;
	  case BRAILLE:
		  Braille_func(&stm_state);
		  break;
	  case EXIT:
		  Exit_func(&stm_state);
		  break;
	  case TROUBLE:
		  Error_func();
		  break;
	  default:
	  	  stm_state=TROUBLE;
	  }

	  GPIO_PinState button1 = HAL_GPIO_ReadPin(GPIOB, GPIO_PIN_1);
	  GPIO_PinState button2 = HAL_GPIO_ReadPin(GPIOA, GPIO_PIN_0);

	 if(button1 == GPIO_PIN_RESET && flag1 == 0)
	 {
		 if(braille_output_index > 7)
		 {
			 braille_output_index -= 8;
		 }
		 clear_val = 1;
		 flag1 = 1;
	 }
	 if(button1 == GPIO_PIN_SET)
	 {
		 flag1 = 0;
	 }



	 if(button2 == GPIO_PIN_RESET && flag2 == 0)
	 {
		 if(braille_output_index < braille_data_size - 1)
		 {
			 braille_output_index += 8;

		 }
		 clear_val = 1;

		 flag2 = 1;
	 }
	 if(button2 == GPIO_PIN_SET)
	 {
		 flag2 = 0;
	 }

	 print_braille_func();

	 /*
	 memset(buf, 0, sizeof(buf));
	 scanf("%s",buf);
	 printf("%s\r\n",buf);
	*/
	//HAL_GPIO_TogglePin(GPIOD, GPIO_PIN_12);
	 HAL_Delay(50);
    /* USER CODE END WHILE */

    /* USER CODE BEGIN 3 */
  }
  /* USER CODE END 3 */
}

/**
  * @brief System Clock Configuration
  * @retval None
  */
void SystemClock_Config(void)
{
  RCC_OscInitTypeDef RCC_OscInitStruct = {0};
  RCC_ClkInitTypeDef RCC_ClkInitStruct = {0};

  /** Configure the main internal regulator output voltage
  */
  __HAL_RCC_PWR_CLK_ENABLE();
  __HAL_PWR_VOLTAGESCALING_CONFIG(PWR_REGULATOR_VOLTAGE_SCALE1);

  /** Initializes the RCC Oscillators according to the specified parameters
  * in the RCC_OscInitTypeDef structure.
  */
  RCC_OscInitStruct.OscillatorType = RCC_OSCILLATORTYPE_HSI;
  RCC_OscInitStruct.HSIState = RCC_HSI_ON;
  RCC_OscInitStruct.HSICalibrationValue = RCC_HSICALIBRATION_DEFAULT;
  RCC_OscInitStruct.PLL.PLLState = RCC_PLL_NONE;
  if (HAL_RCC_OscConfig(&RCC_OscInitStruct) != HAL_OK)
  {
    Error_Handler();
  }

  /** Initializes the CPU, AHB and APB buses clocks
  */
  RCC_ClkInitStruct.ClockType = RCC_CLOCKTYPE_HCLK|RCC_CLOCKTYPE_SYSCLK
                              |RCC_CLOCKTYPE_PCLK1|RCC_CLOCKTYPE_PCLK2;
  RCC_ClkInitStruct.SYSCLKSource = RCC_SYSCLKSOURCE_HSI;
  RCC_ClkInitStruct.AHBCLKDivider = RCC_SYSCLK_DIV1;
  RCC_ClkInitStruct.APB1CLKDivider = RCC_HCLK_DIV1;
  RCC_ClkInitStruct.APB2CLKDivider = RCC_HCLK_DIV1;

  if (HAL_RCC_ClockConfig(&RCC_ClkInitStruct, FLASH_LATENCY_0) != HAL_OK)
  {
    Error_Handler();
  }
}

/* USER CODE BEGIN 4 */
void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart)
{
	if(huart->Instance == USART2)
	{
		if(key_value != '\0')
		{
			buf[buf_cnt] = key_value;
			buf_cnt++;

		    if(buf_cnt >= 140) buf_cnt = 0;

		    if(key_value == '<')
		    {
				buf[0] = key_value;
		    	buf_cnt = 1;
		    }

		    if(key_value == '>')
		    {
		    	buf[buf_cnt] = '\0';
		    	recieve_flag = 1;
		    }
		}
		HAL_UART_Receive_IT(&huart2, &key_value, 1);
	}
}
/* USER CODE END 4 */

/**
  * @brief  This function is executed in case of error occurrence.
  * @retval None
  */
void Error_Handler(void)
{
  /* USER CODE BEGIN Error_Handler_Debug */
  /* User can add his own implementation to report the HAL error return state */
  __disable_irq();
  while (1)
  {
  }
  /* USER CODE END Error_Handler_Debug */
}

#ifdef  USE_FULL_ASSERT
/**
  * @brief  Reports the name of the source file and the source line number
  *         where the assert_param error has occurred.
  * @param  file: pointer to the source file name
  * @param  line: assert_param error line source number
  * @retval None
  */
void assert_failed(uint8_t *file, uint32_t line)
{
  /* USER CODE BEGIN 6 */
  /* User can add his own implementation to report the file name and line number,
     ex: printf("Wrong parameters value: file %s on line %d\r\n", file, line) */
  /* USER CODE END 6 */
}
#endif /* USE_FULL_ASSERT */
