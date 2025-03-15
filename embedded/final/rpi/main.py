'''
1. 이충혁 (2023.07.21)
2. main.py
- 기능 : 기기의 메인 응용프로그램
- 내용 : 상태 관리, 모듈별 응용프로그램 실행, 웹서버 실행
3. 수정목록
'''

from http import HTTPStatus
from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import multiprocessing as mp
#import joypad
import stm_serial
import tts
import guide
from state import State

server = Flask(__name__)
CORS(server)



main_state = State.Init.value
proc_joypad = None
proc_repeat = None
manager = mp.Manager()

'''
- 기능 : 서버 기본 URI(/) 출력
- 인자 : 
- 반환값 : 서버가동중 문자열
'''
@server.route('/')
def hello():
    return "device server running"

# 초기화면
@server.route('/device/init', methods=['GET'])
def device_init():
    global main_state, proc_repeat
    main_state = State.Init.value
    print("Init start")


    guide.guide_multi(main_state, None, 5)
    print("Init end")
    
    return jsonify({'status': HTTPStatus.OK})


@server.route('/device/menulist', methods=['POST'])
def device_menulist():
    global main_state, proc_repeat
    main_state = State.Menulist.value

    params = request.get_json()
    print(params)


    print("firstmenulist start")
    
    guide.guide_multi(main_state, params, 5)
    print("firstmenulist end")

    return jsonify({'data': params, 'status': HTTPStatus.OK})

@server.route('/device/menulist/move', methods=['POST'])
def device_menulist_move():
    global main_state, proc_repeat

    main_state = State.MenulistMove.value

    params = request.get_json()
    print(params)

    print("device_menulist_move start")
    guide.guide_multi(main_state, params, 5)
    print("device_menulist_move end")

    return jsonify({'data': params, 'status': HTTPStatus.OK})


@server.route('/device/menulist/category', methods=['POST'])
def device_menulist_category():
    global main_state, proc_repeat

    main_state = State.MenulistCategory.value

    params = request.get_json()
    print(params)

    print("device_menulist_category start")
    guide.guide_multi(main_state, params, 5)
    print("device_menulist_category end")

    return jsonify({'data': params, 'status': HTTPStatus.OK})

@server.route('/device/menulist/select', methods=['POST'])
def device_menulist_select():
    global main_state, proc_repeat

    main_state = State.MenulistSelect.value

    params = request.get_json()
    print(params)

    print("device_menulist_select start")
    guide.guide_multi(main_state, params, 5)
    print("device_menulist_select end")

    return jsonify({'data': params, 'status': HTTPStatus.OK})

@server.route('/device/menulist/past', methods=['GET'])
def device_menulist_past():
    global main_state, proc_repeat

    main_state = State.MenulistPast.value

    print("device_menulist_past start")
    guide.guide_multi(main_state, None, 5)
    print("device_menulist_past end")

    return jsonify({'status': HTTPStatus.OK})

@server.route('/device/menulist/past/result', methods=['POST'])
def device_menulist_past_result():
    global main_state, proc_repeat

    main_state = State.MenulistPastResult.value

    params = request.get_json()
    print(params)

    print("device_menulist_past_result start")
    guide.guide_multi(main_state, params, 5)
    print("device_menulist_past_result end")

    return jsonify({'data': params, 'status': HTTPStatus.OK})

@server.route('/device/basket', methods=['POST'])
def device_basket():
    global main_state, proc_repeat

    main_state = State.Basket.value

    params = request.get_json()
    print(params)

    print("device_Basket start")
    guide.guide_multi(main_state, params, 5)
    print("device_Basket end")

    return jsonify({'data': params, 'status': HTTPStatus.OK})

@server.route('/device/basket/move', methods=['POST'])
def device_basket_move():
    global main_state, proc_repeat

    main_state = State.BasketMove.value

    params = request.get_json()
    print(params)

    print("device_Basket_move start")
    guide.guide_multi(main_state, params, 5)
    print("device_Basket_move end")

    return jsonify({'data': params, 'status': HTTPStatus.OK})

@server.route('/device/basket/select', methods=['POST'])
def device_basket_select():
    global main_state, proc_repeat

    main_state = State.BasketSelect.value

    params = request.get_json()
    print(params)

    print("device_Basket_select start")
    guide.guide_multi(main_state, params, 5)
    print("device_Basket_select end")

    return jsonify({'data': params, 'status': HTTPStatus.OK})

@server.route('/device/basket/change', methods=['POST'])
def device_basket_change():
    global main_state, proc_repeat

    main_state = State.BasketChange.value

    params = request.get_json()
    print(params)

    print("device_Basket_change start")
    guide.guide_multi(main_state, params, 5)
    print("device_Basket_change end")

    return jsonify({'data': params, 'status': HTTPStatus.OK})

@server.route('/device/basket/delete', methods=['POST'])
def device_basket_delete():
    global main_state, proc_repeat

    main_state = State.BasketDelete.value

    params = request.get_json()
    print(params)

    print("device_Basket_delete start")
    guide.guide_multi(main_state, params, 5)
    print("device_Basket_delete end")

    return jsonify({'data': params, 'status': HTTPStatus.OK})

@server.route('/device/basket/delete/result', methods=['POST'])
def device_basket_delete_result():
    global main_state, proc_repeat

    main_state = State.BasketDeleteResult.value

    params = request.get_json()
    print(params)

    print("device_Basket_delete_result start")
    guide.guide_multi(main_state, params, 5)
    print("device_Basket_delete_result end")

    return jsonify({'data': params, 'status': HTTPStatus.OK})

@server.route('/device/complete', methods=['POST'])
def device_complete():
    global main_state, proc_repeat

    main_state = State.Complete.value

    params = request.get_json()
    print(params)

    print("device_complete start")
    guide.guide_multi(main_state, params, 5)
    print("device_complete end")

    return jsonify({'data': params, 'status': HTTPStatus.OK})

@server.route('/device/complete/result', methods=['POST'])
def device_complete_result():
    global main_state, proc_repeat

    main_state = State.CompleteResult.value

    params = request.get_json()
    print(params)

    print("device_complete_result start")
    guide.guide_multi(main_state, params, 5)
    print("device_complete_result end")

    return jsonify({'data': params, 'status': HTTPStatus.OK})


def init_func():
    global main_state, proc_joypad

    print("init start")


    #proc_joypad = mp.Process(target=joypad.wait_joypad)
    #proc_joypad.start()
    tts.init_tts()
    stm_serial.init_stm()
    print("init end")

def error_func():
    print("error start")
    print("error end")

def exit_func():
    print("exit")
 #   tts.exit_tts()
    if proc_joypad.is_alive():
        proc_joypad.terminate()
        proc_joypad.join()



if __name__ == "__main__":

    init_func()
    print(main_state)

    #print(f"Main process PID: {mp.current_process().pid}")
    server.run(host = "0.0.0.0", port = "5000")
    #server.run(host = "0.0.0.0", port = "5000", ssl_context=('nginx_ssl.crt', 'private.key'))

    # WebDriver 종료
    print("WebDriver 종료")
    driver.quit()
    exit_func()
