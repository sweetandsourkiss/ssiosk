import BD # python import 할 때는 .py 빼기

'''
초성, 중성, 종성 분리
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
한글자를 점자로 변환
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
문자열->점자
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
        elif w in BD.BNUM: # 숫자
            if flag:
                ble+='/010111' # 숫자임을 표기
            flag=False
            ble+=BD.BNUM[w]
        elif w in BD.BABBREVIATION:
            # 약어가 있다
            ble+=BD.BABBREVIATION[w]
        else:
            # 약어가 없다 seperate 해야함
            word_lst = seperate_word(w)
            #print(word_lst)
            # lst를 보내서 점자로 변환하기
            ble+=conversion_braille(word_lst)
    return ble

'''
main에서 호출 함수
'''
def to_braille(words):
    ble = translate_braille(words)
    # serial 통신으로 전송하기
    # 양식
    '''
    Serial통신으로 16글자 점자까지I   
    ->
    <pi/braille/101011/10010/101001>
    '''
    fm = '<pi/braille'
    for i in range(0,len(ble),112):
        print(fm+ble[i:i +112]+'>')

# test code
text = to_braille(input())
print(text)
