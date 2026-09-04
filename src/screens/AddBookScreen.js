import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import { saveBook } from '../services/storageService';
import { CATEGORIES, STATUS_OPTIONS } from '../services/categoryService';

export default function AddBookScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].name);
  const [selectedStatus, setSelectedStatus] = useState(STATUS_OPTIONS[0].value);
  const [totalPages, setTotalPages] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = async () => {
    if (!title.trim() || !author.trim()) {
      Alert.alert('Erro', 'Título e autor são obrigatórios!');
      return;
    }

    const book = {
      title: title.trim(),
      author: author.trim(),
      category: selectedCategory,
      status: selectedStatus,
      totalPages: parseInt(totalPages) || 0,
      currentPage: selectedStatus === 'read' ? parseInt(totalPages) || 0 : 0,
      description: description.trim(),
      rating: 0,
    };

    const savedBook = await saveBook(book);
    
    if (savedBook) {
      Alert.alert('Sucesso', 'Livro cadastrado com sucesso!');
      navigation.goBack();
    } else {
      Alert.alert('Erro', 'Não foi possível salvar o livro.');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Novo Livro" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Título *</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="book" size={20} color="#666666" />
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Digite o título do livro"
                placeholderTextColor="#999999"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Autor *</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="account" size={20} color="#666666" />
              <TextInput
                style={styles.input}
                value={author}
                onChangeText={setAuthor}
                placeholder="Digite o nome do autor"
                placeholderTextColor="#999999"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categoria</Text>
            <View style={styles.optionsContainer}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.optionButton,
                    selectedCategory === category.name && styles.optionButtonSelected,
                    { borderColor: category.color }
                  ]}
                  onPress={() => setSelectedCategory(category.name)}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      selectedCategory === category.name && styles.optionTextSelected
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Status de Leitura</Text>
            <View style={styles.optionsContainer}>
              {STATUS_OPTIONS.map((status) => (
                <TouchableOpacity
                  key={status.id}
                  style={[
                    styles.optionButton,
                    selectedStatus === status.value && styles.optionButtonSelected,
                    { borderColor: status.color }
                  ]}
                  onPress={() => setSelectedStatus(status.value)}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      selectedStatus === status.value && styles.optionTextSelected
                    ]}
                  >
                    {status.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Total de Páginas</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="pages" size={20} color="#666666" />
              <TextInput
                style={styles.input}
                value={totalPages}
                onChangeText={setTotalPages}
                placeholder="Quantas páginas tem o livro?"
                placeholderTextColor="#999999"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Adicione uma descrição (opcional)"
              placeholderTextColor="#999999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salvar Livro</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#333333',
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#DDDDDD',
    marginRight: 8,
    marginBottom: 8,
  },
  optionButtonSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#eff6ff',
  },
  optionText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '600',
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});