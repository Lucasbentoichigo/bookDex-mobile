import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import CategoryBadge from '../components/CategoryBadge';
import ProgressBar from '../components/ProgressBar';
import { getStatusByValue } from '../services/categoryService';
import { formatDate, formatPercentage } from '../utils/formatters';
import { calculateReadingProgress } from '../utils/missionUtils';
import { colors, spacing, borderRadius } from '../constants/colors';

export default function BookDetailScreen({ route, navigation }) {
  const { book } = route.params;
  const statusData = getStatusByValue(book.status);
  const progress = calculateReadingProgress(book.currentPage, book.totalPages);

  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <MaterialCommunityIcons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={24}
            color={star <= rating ? colors.accent : colors.border}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Detalhes do Livro" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="book-open-page-variant" size={64} color={colors.primary} />
          </View>

          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>{book.author}</Text>

          <View style={styles.badgesContainer}>
            <CategoryBadge category={book.category} size="large" />
            {statusData && (
              <View style={[styles.badge, { backgroundColor: statusData.color }]}>
                <Text style={styles.badgeText}>{statusData.label}</Text>
              </View>
            )}
          </View>

          {book.totalPages > 0 && (
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Progresso de Leitura</Text>
                <Text style={styles.progressValue}>{formatPercentage(book.currentPage, book.totalPages)}%</Text>
              </View>
              <ProgressBar progress={progress} />
              <Text style={styles.pagesText}>
                Página {book.currentPage} de {book.totalPages}
              </Text>
            </View>
          )}

          {book.rating > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Avaliação</Text>
              {renderStars(book.rating)}
            </View>
          )}

          {book.description ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descrição</Text>
              <Text style={styles.description}>{book.description}</Text>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações</Text>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="calendar" size={20} color={colors.textSecondary} />
              <Text style={styles.infoText}>Adicionado em: {formatDate(book.createdAt)}</Text>
            </View>
            {book.updatedAt && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="pencil" size={20} color={colors.textSecondary} />
                <Text style={styles.infoText}>Atualizado em: {formatDate(book.updatedAt)}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('EditBook', { book })}
          >
            <MaterialCommunityIcons name="pencil" size={20} color={colors.white} />
            <Text style={styles.actionButtonText}>Editar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => {
              navigation.goBack();
              // A exclusão será tratada na tela anterior
            }}
          >
            <MaterialCommunityIcons name="delete" size={20} color={colors.white} />
            <Text style={styles.actionButtonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  card: {
    backgroundColor: colors.surface,
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  author: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  badge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginLeft: spacing.sm,
  },
  badgeText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 12,
  },
  progressSection: {
    marginBottom: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  progressValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  pagesText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});