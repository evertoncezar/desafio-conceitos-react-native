import React, { useEffect, useState } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Image
} from "react-native";

import api from './services/api';

export default function App() {

 

  const [repositories, setRepositories] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
      setRefreshing(false);
    });

  }, [refreshing]);

  async function handleLikeRepository(id) {
    //"Like Repository" functionality
    const response = await api.post(`/repositories/${id}/like`);

    const retRepository = response.data;

    const newRepositories = repositories.map(repository => {
      if (repository.id === id) {
        repository.likes = retRepository.likes;
      }
      return repository;
    });

    setRepositories(newRepositories);
  }

  async function onRefresh() {
    setRefreshing(true);
  }

  async function handleDeleteRepository(id) {

    await api.delete(`/repositories/${id}`);

    const indexRepository = repositories.findIndex(repository => repository.id === id);
    const newRepositories = repositories.map((x) => x);
    newRepositories.splice(indexRepository, 1);
    setRepositories(newRepositories);

  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={repositories}
          keyExtrator={repository => repository.id}
          renderItem={({ item: repository }) => {
            return (
              <View style={styles.repositoryContainer}>

                <View style={styles.likesContainer}>
                <Text style={styles.repository}>{repository.title}</Text> 
                <View >
                      <Image style={ styles.imageLike } source={{ uri: 'https://publicdomainvectors.org/photos/1425710397.png' }}/>
                      
                      <Text
                        style={styles.likeText}
                        testID={`repository-likes-${repository.id}`}
                      >
                    {`${repository.likes}`}
                  </Text>
                  </View>
                </View>
                
                <View style={styles.techsContainer}>
                  {repository.techs.map(tech => {
                    return (

                      <Text key={tech} style={styles.tech}>
                        {tech}
                      </Text>

                    );
                  })}
                </View>

                <View style={styles.viewButton}>
                <TouchableOpacity 
                style={ styles.buttonContainer }
                onPress={() => handleLikeRepository(repository.id)}
                testID={`like-button-${repository.id}`}
                >  
                    <Image style={ styles.imageButton } source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQsOZyWXcA-JZXt2nF9CfkSrsYH_PU1mgDFbQ&usqp=CAU' }} />
                </TouchableOpacity> 
                  <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={() => handleDeleteRepository(repository.id)}
                  >
                     <Image style={ styles.imageButton } source={{ uri: 'https://cdn.icon-icons.com/icons2/1150/PNG/512/1486504830-delete-dustbin-empty-recycle-recycling-remove-trash_81361.png' }} />
                     
                  </TouchableOpacity>
                </View>

              </View>
            );
          }} />

      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    flex: 1,
    fontSize: 32,
    color: "#6687c4",
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 20,
    color: "#6687c4",
    fontWeight: "bold",
    textAlign: "center",
    
  },
  imageLike: {
    height:48,
    width: 48,
    borderRadius: 48,
    marginLeft: 5,
  },
  viewButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
  buttonContainer: {
    height:48,
    width: 48,
    borderRadius: 48
  },
  imageButton: {
    height:48,
    width: 48,
    borderRadius: 48
  },

});
