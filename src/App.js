import React, { useEffect, useState } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  RefreshControl
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
                <Text style={styles.repository}>{repository.title}</Text>
                <View style={styles.techsContainer}>
                  {repository.techs.map(tech => {
                    return (

                      <Text key={tech} style={styles.tech}>
                        {tech}
                      </Text>

                    );
                  })}
                </View>
                <View style={styles.likesContainer}>
                  <Text
                    style={styles.likeText}
                    testID={`repository-likes-${repository.id}`}
                  >
                    {`${repository.likes} curtidas`}
                  </Text>
                </View>
                <View style={styles.sepButton}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleLikeRepository(repository.id)}
                    testID={`like-button-${repository.id}`}
                  >
                    <Text style={styles.buttonText}>  Curtir  </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleDeleteRepository(repository.id)}
                  >
                    <Text style={styles.buttonText}>  Delete  </Text>
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
    fontSize: 32,
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
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  sepButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
});
