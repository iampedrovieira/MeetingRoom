import requests
import datetime

url = "http://localhost:3341/api/user/iadata"

headers = {"Content-Type": "application/json"}

response = requests.request("GET", url, headers=headers)
data_in_json = response.json()
#Organizar dados numa matriz
# ex: [[initdate,enddate,diaSemana],[initdate,enddate,diaSemana]...]

labels = ['initdate','enddate','duration','weekDay','seats','roomid']
data = []
for row in data_in_json:
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

    #data_row = [final_initTime,final_endTime,duration,weekDay,seats,roomid]
    data_row = [final_initTime,duration,roomid]
    data.append(data_row)

#Tratamendo de dados para analisar o modelo

import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import numpy as np


#Vamos ter em conta no primeiro teste o initDate duration e weekday
X=np.array(data)

#Separar o que vai ser analisado e o que vai ser avaliado como resultado

data_lable = X[:,2]
data_values = X[:,:-1]

#Separar em dados de treino e teste
from sklearn.model_selection import train_test_split

X_train, X_test ,Y_train, Y_test = train_test_split(data_values,data_lable,test_size=0.2)
'''
#Dimensionamento dos dados
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
scaler.fit(X_train)

X_train = scaler.transform(X_train)
X_test =scaler.transform(X_test)
'''
#"Treino" e precisões

from sklearn.neighbors import KNeighborsClassifier
classifier = KNeighborsClassifier(n_neighbors=10)
classifier.fit(X_train,Y_train)

y_pred = classifier.predict(X_test)

#Matriz para analisar os resultados
from sklearn.metrics import classification_report, confusion_matrix
print(confusion_matrix(Y_test,y_pred))
print(classification_report(Y_test,y_pred))

#Calcular o melhor k

error=[]
for i in range(1,40):
    knn = KNeighborsClassifier(n_neighbors=i)
    knn.fit(X_train,Y_train)
    predict_i= knn.predict(X_test)
    error.append(np.mean(predict_i != Y_test))

plt.figure()
for i in range(len(X)):

    plt.scatter(X[i,0],X[i,1])
    #plt.text(X[i,0],X[i,1],X[i,3],size=5,color='k')
plt.title('AAAAAAAAAAA')
plt.xlabel(labels[0])
plt.ylabel(labels[1])
plt.show()

plt.figure(figsize=(12,6))
plt.plot(range(1,40),error,color='red',linestyle='dashed',marker='o',markerfacecolor='blue',markersize=10)
plt.title('error Rate K Value')
plt.xlabel('K Value')
plt.ylabel('Mean error')
plt.show()



# Visualizar Dados normais
'''
fig=plt.figure()
ax = fig.add_subplot(111,projection='3d')
ax.set_xlabel(labels[0])
ax.set_ylabel(labels[2])
ax.set_zlabel(labels[3])

for i in range(len(X)):

    ax.scatter(X[i,0],X[i,1],X[i,2])
    ax.text(X[i,0],X[i,1],X[i,2],X[i,3],size=5,color='k')
plt.show()
'''
'''
from sklearn.model_selection import train_test_split

#Divisão dos dados de treino e teste

X_train, X_teste ,Y_train, Y_teste = train_test_split()

from sklearn.preprocessing import StandardScaler

data_final =[X[:,0],X[:,2],X[:,3]]
scaler = StandardScaler()
scaler.fit(data_final)

X_Final= scaler.transform(data_final)

fig=plt.figure()
ax = fig.add_subplot(111,projection='3d')
ax.set_xlabel(labels[0])
ax.set_ylabel(labels[2])
ax.set_zlabel(labels[3])
X=np.array(data)

for i in range(len(X_Final)):

    ax.scatter(X_Final[i,0],X_Final[i,2],X_Final[i,3])
    ax.text(X_Final[i,0],X_Final[i,2],X_Final[i,3],X[i,5],size=5,color='k')
plt.show()
'''
