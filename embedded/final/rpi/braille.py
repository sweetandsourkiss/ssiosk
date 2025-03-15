'''
1. 이상린 (2023.07.31)
2. BD.py
- 기능 : 점자 변환 알고리즘
- 내용 : 문자 -> 점자(000000 형식, /로 분리) 변환 
3. 수정목록
- 이상린 (2023.08.02) : 기호, 숫자 추가
'''

import BD # python import 할 때는 .py 빼기

'''
- 기능 : 초성, 중성, 종성 분리
- 인자 : seperate_word(한글자 한글):
- 반환값 : 분리한 한글자 list ex) ['ㅇ','ㅏ','ㄴ']
'''
def seperate_word(w):
    r_lst = []
    ## 영어인 경우 구분해서 작성함. 
    if '가'<=w<='힣':
        ## 588개 마다 초성이 바뀜. 
        ch1 = (ord(w) - ord('가'))//588
        ## 중성은 총 28가지 종류
        ch2 = ((ord(w) - ord('가')) - (588*ch1)) // 28
        ch3 = (ord(w) - ord('가')) - (588*ch1) - 28*ch2
        r_lst.extend([BD.CHOSUNG[ch1], BD.JUNGSUNG[ch2], BD.JONGSUNG[ch3]])
    else:
        r_lst.extend([w])    
    return r_lst

'''
- 기능 : 은/는 이/가 붙이기
- 인자 : make_part(이/가 : 1 은/는 : 2,단어)
- 반환값 : ex)짜장면은
'''
def make_part(ver,word):
    w = seperate_word(word[-1])
    if w[2]!=' ':
        ver+=10
    return word+BD.PART[ver]

'''
- 기능 : 분리된 한글자 리스트를 점자로 변환
- 인자 : conversion_braille(분리한 한글자 list ex) ['ㅇ','ㅏ','ㄴ']):
- 반환값 : 변환한 점자
'''
def conversion_braille(word):
    ble = ''
    # 중성이 'ㅏ'인지 알아야함
    if word[1]=='ㅏ' and word[0] in BD.BABBREVIATION:
        # if 약어가 있다면
        # 초중 약어로 변환 -> 종성 따로 변환
        ble+=BD.BABBREVIATION[word[0]]
        ble+=BD.BJONGSUNG[word[2]]
    else:
        # 초,중,종 따로 변환하기
        ble+=BD.BCHOSUNG[word[0]]
        ble+=BD.BJUNGSUNG[word[1]]
        ble+=BD.BJONGSUNG[word[2]]
    return ble

'''
- 기능 : 문자열->점자 알고리즘
- 인자 : translate_braille(문자열)
- 반환값 : 최종 변환 점자
'''
def translate_braille(words):
    # 1. 한글자씩 분리하기
    words_lst = list(words)
    # 2. 한글자씩 점자로 변환하기
    # -> if 약어가 있다면 바로 변환
    # -> else 초중종 나눠서 봐야함
    ble = ''
    flag = True
    for w in words_lst:
        if w == ' ': # 띄어쓰기
            ble+='/000000'
            flag=True
            
        elif w in BD.BNUM: # 숫자
            if flag:
                ble+='/010111' # 숫자임을 표기
            flag=False
            ble+=BD.BNUM[w]
            
        elif w in BD.BETC: # 기호
            ble+=BD.BETC[w]
            flag=True
            
        elif w in BD.BABBREVIATION:
            # 약어가 있다
            ble+=BD.BABBREVIATION[w]
            flag=True

        else:
            # 약어가 없다 seperate 해야함
            word_lst = seperate_word(w)
            #print(word_lst)
            # lst를 보내서 점자로 변환하기
            ble+=conversion_braille(word_lst)
            flag=True
    return ble

'''
- 기능 : main에서 호출할 최종 점자 프로그램
- 양식 : serial통신으로 16글자 점자까지
    -> <pi/braille/101011/10010/101001>
- 인자 : to_braille(문자열)
- 반환값 : 점자 + 통신양식
### 미완성 - 추후 guide로 옮겨질 알고리즘
'''
def to_braille(words):
    ble = translate_braille(words)
    fm = '<pi/braille'
    for i in range(0,len(ble),112):
        print(fm+ble[i:i +112]+'>')

# test code
if __name__ == "__main__":
    text = to_braille(input())
    print(text)

    t = input("먹고싶은 메뉴 : ")
    print(make_part(1,t),make_part(2,t))
