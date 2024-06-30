from sklearn.neighbors import KNeighborsClassifier
from models.data_processing_v1 import *

def model_v1(data_to_model,data_to_predict):

    data_model,data_labels,data_to_predict=process_data(data_to_model,data_to_predict)

    knn = KNeighborsClassifier(n_neighbors=7)
    knn.fit(data_model,data_labels)
    rooms_labels = sorted(list(dict.fromkeys(data_labels)))
    predict = knn.predict(data_to_predict)
    predict_list = knn.predict_proba(data_to_predict)

    room_list = predict_list.tolist()[0]
   
    #order by % hight to low
    for i in range(0,len(rooms_labels)):
        for j in range(0,len(room_list)):
            if room_list[i]>room_list[j]:
                room_list[j],room_list[i] = room_list[i],room_list[j]
                rooms_labels[j],rooms_labels[i] = rooms_labels[i],rooms_labels[j]

    #clear 0.0% values
    final_labels =[]
    final_values = []
    for i in range(0,len(rooms_labels)):
            if room_list[i]>0:
                final_values.append(room_list[i])
                final_labels.append(int(rooms_labels[i]))

    return final_labels,final_values

    #something...

        