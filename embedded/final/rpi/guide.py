'''
1. 이상린 (2023.08.04)
2. testguide.py
- 기능 : guide.py 코드 리펙토링 / 테스트 후 guide로 승급
3. 수정목록
- 이상린 (2023.08.08) : 은/는/이/가 추가
'''

import multiprocessing as mp
import time
import stm_serial
import tts
import sounddevice as sd
import braille
import scenario
from state import State

def tts_repeat(tts_str, wait_time):
    while True:
        print(f"wait time : {wait_time}")
        tts.text_to_speech(tts_str);
        sd.wait()
        print("재생 완료")
        time.sleep(wait_time)


def braille_multi(braille_str):
    ble = braille.translate_braille(braille_str)
    # serial 통신으로 전송하기
    # 양식
    '''
    Serial통신으로 16글자 점자까지
    ->
    <pi/braille/101011/10010/101001>
    '''
    fm = '<pi/braille'
    for i in range(0,len(ble),112):
        encode_str = fm + ble[i:i+112]+'>'
        print(encode_str)
        stm_serial.communicate_stm(encode_str)

    stm_serial.communicate_stm("<pi/braille/end>")
    print("<pi/braille/end>")

def guide_multi(main_state, json_data, wait_time):
    global proc_tts, proc_braille

    tts_str = None
    braille_str = None

    if main_state == State.Init.value:
        tts_str = scenario.STTS[State.Init.value]
        braille_str = scenario.SBRA[State.Init.value]
    
    elif main_state == State.Menulist.value:
        tts_str = scenario.STTS[State.Menulist.value]
        tts_str += f"현재 {json_data['categoryName']} 카테고리입니다.\
{json_data['categoryQty']}개 메뉴 중 1번인 {json_data['menuName']} ,\
{json_data['menuPrice']}원 입니다."

        braille_str = scenario.SBRA[State.Menulist.value]
        braille_str += f"현재 {json_data['categoryName']} 카테고리.\
1/{json_data['categoryQty']} {json_data['menuName']}, {json_data['menuPrice']}원"

    elif main_state == State.MenulistMove.value:
        tts_str = f"{scenario.SCOM[json_data['eventDir']]} 메뉴입니다.\
{json_data['categoryQty']}개 메뉴 중 {json_data['menuIdx']}번인 \
{json_data['menuName']}, {json_data['menuPrice']}원 입니다."

        braille_str = f"{scenario.SCOM[json_data['eventDir']]} 메뉴.\
{json_data['menuIdx']}/{json_data['categoryQty']} {json_data['menuName']}, {json_data['menuPrice']}원"

    elif main_state == State.MenulistCategory.value:
        tts_str = f"{scenario.SCOM[json_data['eventDir']]} 카테고리입니다.\
{json_data['categoryName']} 카테고리 입니다.\
{json_data['categoryQty']}개의 메뉴중 {json_data['menuIdx']}번인 {json_data['menuName']}, {json_data['menuPrice']}원 입니다."

        braille_str = f"{scenario.SCOM[json_data['eventDir']]} 선택\
{json_data['categoryName']} 카테고리.\
{json_data['menuIdx']}/{json_data['categoryQty']} {json_data['menuName']}, {json_data['menuPrice']}원"

    elif main_state == State.MenulistSelect.value:
        tts_str = f"{braille.make_part(1,json_data['menuName'])} {scenario.SCOM[json_data['eventSel']]} 되었습니다."
        braille_str = f"{json_data['menuName']} {scenario.SCOM[json_data['eventSel']]}"

    elif main_state == State.MenulistPast.value:
        tts_str = f"초기화면으로 돌아가시겠습니까?\
확인 하려면 조이스틱을 한번, 취소 하려면 조이스틱을 두번 눌러주세요."
        braille_str = f"초기화면으로 돌아가시겠습니까 \
확인 하려면 조이스틱을 한번, 취소 하려면 조이스틱을 두번 눌러주세요."
    elif main_state == State.MenulistPastResult.value:
        if json_data['eventRes'] == 1:
            tts_str = f"초기화면으로 돌아갑니다."
            braille_str = f"초기화면 확인"
        else:
            tts_str = f"취소 되었습니다."
            braille_str = f"초기화면 취소"

    elif main_state == State.Basket.value:
        tts_str = scenario.STTS[State.Basket.value]
        tts_str += f"{json_data['orderQty']}개의 메뉴, 총금액은 {json_data['orderPrice']}원입니다.\
{json_data['orderQty']}개의 메뉴 중 1번인 {json_data['menuName']}, 1개 담았습니다."

        braille_str = scenario.SBRA[State.Basket.value]
        braille_str += f"{json_data['orderQty']}개의 메뉴, 총금액은 {json_data['orderPrice']}원.\
1/{json_data['orderQty']} {json_data['menuName']},1개."

    elif main_state == State.BasketMove.value:
        tts_str = f"{scenario.SCOM[json_data['eventDir']]}메뉴 입니다.\
{json_data['orderQty']}개의 메뉴 중 {json_data['orderIdx']}번인 {json_data['menuName']}, {json_data['menuQty']}개 담았습니다."

        braille_str = f"{scenario.SCOM[json_data['eventDir']]}메뉴.\
{json_data['orderIdx']}/{json_data['orderQty']} {json_data['menuName']}, {json_data['menuQty']}개."

    elif main_state == State.BasketSelect.value:
        tts_str = f"{braille.make_part(2,json_data['menuName'])} {json_data['menuPrice']}원이며,\
{json_data['menuDesc']}입니다."
        braille_str = f"{braille.make_part(2,json_data['menuName'])} {json_data['menuPrice']}원.\
{json_data['menuDesc']}."

    elif main_state == State.BasketChange.value:
        tts_str = f"{braille.make_part(1,json_data['menuName'])} 1개 {scenario.SCNT[json_data['eventDir']]} 되어 현재 {json_data['menuQty']}개입니다."
        braille_str = f"{braille.make_part(1,json_data['menuName'])} 1개 {scenario.SCNT[json_data['eventDir']]} 현재 {json_data['menuQty']}개."

    elif main_state == State.BasketDelete.value:
        tts_str = f"{braille.make_part(1,json_data['menuName'])} 1개  감소 되면 메뉴가 삭제됩니다.\
확인 하려면 조이스틱을 한번, 취소 하려면 조이스틱을 두번 눌러주세요."
        braille_str = f"{braille.make_part(1,json_data['menuName'])} 1개  감소 되면 메뉴가 삭제됩니다.\
확인 하려면 조이스틱을 한번, 취소 하려면 조이스틱을 두번 눌러주세요."
    elif main_state == State.BasketDeleteResult.value:
        if json_data['eventRes'] == 1:
            tts_str = f"삭제가 확인되었습니다."
            braille_str = f"삭제 확인"
        else:
            tts_str = f"삭제가 취소되었습니다."
            braille_str = f"삭제 취소"

        if json_data['eventEmptyBasket'] == 1:
            tts_str += f"초기화면으로 돌아갑니다."
            braille_str += f" 초기화면으로 돌아갑니다."

    elif main_state == State.Complete.value:
        tts_str = f"총금액은 {json_data['orderPrice']}원 이며, "
        for item in json_data["order"]:
            tts_str += f"{item['menuName']} {item['menuQty']}개,"

        tts_str += f"주문합니다.\
        주문 완료하려면 조이스틱을 한번, 취소 하려면 조이스틱을 두번 눌러주세요."

        braille_str = f"총금액: {json_data['orderPrice']}원 "
        for item in json_data["order"]:
            braille_str += f"{item['menuName']} {item['menuQty']}개,"

        braille_str += f" 입니다 주문 완료하려면 조이스틱 1번 누르세요"


    elif main_state == State.CompleteResult.value:
        tts_str = scenario.STTS[json_data['eventRes']]
        braille_str = scenario.SBRA[json_data['eventRes']]

    # tts 문자열 출력
    print(tts_str)
    print(braille_str)
    # tts guide multiprocessing

    #print(sd.get_stream().active)


    # braille guide multi processing
    if proc_braille is not None:
        if proc_braille.is_alive():
            proc_braille.terminate()
            proc_braille.join()
            print("kill past process")



    proc_braille = mp.Process(target=braille_multi, args=(braille_str,))
    proc_braille.start()
    print("proc start")


    tts.stop_audio()
    print("중지 됐나요")

    if proc_tts is not None:
        if proc_tts.is_alive():
            proc_tts.terminate()
            proc_tts.join()
            print("hello hello")


    proc_tts = mp.Process(target=tts_repeat, args=(tts_str, wait_time,))
    proc_tts.start()

proc_tts = None
proc_braille = None
