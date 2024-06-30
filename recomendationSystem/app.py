from flask import request,Flask,jsonify, Response
from models.knn_v1 import *
app = Flask(__name__)

@app.route('/api/recommender_by_user', methods=['POST'])
def recommender_by_user():
    
    data_to_model = request.get_json()['data']
    data_to_predict = request.get_json()['reserve_input']
    free_rooms = request.get_json()['free_rooms']  
    p_room_list,p_room_list_probability=model_v1(data_to_model,data_to_predict)

    recomended_room = -1
    for room in p_room_list:
        for i in range(0,len(free_rooms)):
            if room == free_rooms[i]['roomid']:
                recomended_room = room
                break
        if recomended_room != -1:
            break
    
    if recomended_room==-1:
        #this loop is for find a number of seats for predict rooms
        for row in data_to_model:
            room_seats=-1
            for room in p_room_list:
                
                 #get room seats
                if row['room']['roomid'] == room:
                    room_seats=row['room']['seats']

                #this loop is for searching a similar free room by seats

                for free_r in free_rooms:
                    if free_r['seats']>=room_seats and free_r['seats']<room_seats+2:
                        recomended_room = free_r['roomid']

            #stop data_to_model loop when discovery a seats and a free room to recomend
            if room_seats!=-1 and recomended_room!=-1:
                break

    if recomended_room != -1:
        response ={'roomid':recomended_room}
        return jsonify(response),200
    else:
        response ={'roomid':-1}
        return jsonify(response),200

if __name__ == '__main__':
    app.run(debug=True)