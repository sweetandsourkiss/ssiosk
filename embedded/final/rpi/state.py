'''
1. 이충혁
2. state.py
- 기능 : 상태 enum
3. 수정목록

'''

from enum import Enum

class State(Enum):
    Error = 0,
    Init = 1,
    Menulist = 2, # 
    MenulistMove = 3,
    MenulistCategory = 4,
    MenulistSelect = 5,
    MenulistPast = 6,
    MenulistPastResult = 7,
    Basket = 8,
    BasketMove = 9,
    BasketSelect = 10,
    BasketChange = 11,
    BasketDelete = 12,
    BasketDeleteResult = 13,
    Complete = 14,
    CompleteResult = 15
