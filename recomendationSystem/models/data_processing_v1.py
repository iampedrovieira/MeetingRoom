import datetime
import numpy as np
from sklearn.preprocessing import StandardScaler

def process_data(model_data,predict_data):

    data = []

    for row in model_data:
        roomid = row['room']['roomid']
        seats = row['room']['seats']
        #clean string data
        date_string = row['initdate'].split('T')[0]
        initdate_string = row['initdate'].split('T')[1].split('.')[0]
        enddate_string = row['enddate'].split('T')[1].split('.')[0]

        initDate = datetime.datetime.strptime(date_string + " "+initdate_string,"%Y-%m-%d %H:%M:%S")
        endDate = datetime.datetime.strptime(date_string + " "+enddate_string,"%Y-%m-%d %H:%M:%S")
        weekDay = initDate.weekday()
        

        #Convert time to int like 1H30 = 1,5
        final_initTime = initDate.hour + (initDate.minute/60)
        final_endTime = endDate.hour + (endDate.minute/60)
        duration = final_endTime - final_initTime

        data_row = [final_initTime,duration,weekDay,roomid]
        data.append(data_row)

    X=np.array(data)

    data_labels = X[:,3]
    data_values = X[:,:-1]

    scaler = StandardScaler()
    scaler.fit(data_values)
    model_data_Final = scaler.transform(data_values)

    #Processing data to predict
    p_start = datetime.datetime.strptime(predict_data['date'] + " "+predict_data['startTime'],"%m-%d-%Y %H:%M")
    p_end = datetime.datetime.strptime(predict_data['date'] + " "+predict_data['endTime'],"%m-%d-%Y %H:%M")
    p_final_initTime = p_start.hour + (p_start.minute/60)
    p_final_endTime = p_end.hour + (p_end.minute/60)
    p_duration = p_final_endTime - p_final_initTime
    p_weekDay = p_start.weekday()
    p_final_data =[p_final_initTime,p_duration,p_weekDay]
    predict_data_final = scaler.transform([p_final_data])

    return model_data_Final,data_labels,predict_data_final
    

