import serial
import time
import threading

'''
count -> 점자정보로 바꿔야함
'''

ser = None 
thread_stop_flag = False

def print_init_stm():
    global ser
    while not thread_stop_flag:
        ser.reset_input_buffer()
        ser.write(str.encode("<pi/init>"))
        time.sleep(0.3)

def init_stm():
    global ser, thread_stop_flag
    ser = serial.Serial('/dev/ttyUSB0', 115200, timeout=1)

    init_stm_thread = threading.Thread(target=print_init_stm)
    init_stm_thread.start() 

    while True:
        if ser.in_waiting > 0:
            line = ser.readline().decode('utf-8').rstrip()
            print(line)
            if line == "<stm/init/ACK>":
                thread_stop_flag = True
                init_stm_thread.join()
                print("탈출")
                return


def communicate_stm(braille_str):
    global ser
    print("in communi")
    while True:

        time.sleep(0.03)
        ser.write(str.encode(braille_str))

        if ser.in_waiting > 0:
            line = ser.readline().decode('utf-8').rstrip()
            ser.reset_input_buffer()
            print(line)    
            
            if line == "<stm/braille/ACK>":
                print("clear")
                ser.reset_input_buffer()
                return
            elif line == "<stm/braille/NACK>":
                print("re communicate")
                ser.reset_input_buffer()
                ser.write(str.encode(braille_str))
                ser.reset_input_buffer()
                
    print("exit communi")
    '''
            print(line) 
            #ser.write(str.encode("byebye\n"))
    '''

def exit_stm():
    pass


