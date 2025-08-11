import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const ExportDataScreen = () => {
  const [selectedFormat, setSelectedFormat] = useState('PDF');
  const [includePhotos, setIncludePhotos] = useState(true);
  const [includeStats, setIncludeStats] = useState(true);
  const [includeRoutes, setIncludeRoutes] = useState(true);
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const exportFormats = ['PDF', 'CSV', 'Excel', 'JSON'];
  const dateRanges = ['Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'Last Year', 'Custom'];

  const recentExports = [
    {
      id: 1,
      name: 'Monthly_Report_Jan_2025.pdf',
      date: '2025-01-15',
      size: '2.4 MB',
      type: 'PDF',
    },
    {
      id: 2,
      name: 'Ride_Statistics_Q4_2024.csv',
      date: '2024-12-30',
      size: '485 KB',
      type: 'CSV',
    },
    {
      id: 3,
      name: 'Horse_Performance_2024.xlsx',
      date: '2024-12-20',
      size: '1.8 MB',
      type: 'Excel',
    },
  ];

  const reportTemplates = [
    {
      id: 1,
      name: 'Performance Summary',
      description: 'Overall riding performance and statistics',
      icon: 'analytics',
    },
    {
      id: 2,
      name: 'Horse Usage Report',
      description: 'Detailed horse usage and performance metrics',
      icon: 'horse',
    },
    {
      id: 3,
      name: 'Trail Analysis',
      description: 'Trail popularity and route statistics',
      icon: 'map',
    },
    {
      id: 4,
      name: 'Community Leaderboard',
      description: 'Top riders and community achievements',
      icon: 'trophy',
    },
  ];

  const handleExport = () => {
    Alert.alert(
      'Export Data',
      `Your data will be exported as ${selectedFormat} for ${dateRange}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => processExport() },
      ]
    );
  };

  const processExport = () => {
    // Export logic here
    Alert.alert('Success', 'Your data has been exported successfully!');
  };

  const handleTemplateSelect = (template: any) => {
    Alert.alert(
      template.name,
      `Generate ${template.name} report?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Generate', onPress: () => generateReport(template) },
      ]
    );
  };

  const generateReport = (template: any) => {
    // Report generation logic
    Alert.alert('Success', `${template.name} has been generated!`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Export Data</Text>
        <TouchableOpacity>
          <Ionicons name="help-circle-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Export Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>EXPORT SETTINGS</Text>
        
        {/* Format Selection */}
        <Text style={styles.label}>Export Format</Text>
        <View style={styles.formatContainer}>
          {exportFormats.map((format) => (
            <TouchableOpacity
              key={format}
              style={[
                styles.formatButton,
                selectedFormat === format && styles.formatButtonActive,
              ]}
              onPress={() => setSelectedFormat(format)}
            >
              <Text
                style={[
                  styles.formatText,
                  selectedFormat === format && styles.formatTextActive,
                ]}
              >
                {format}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date Range */}
        <Text style={styles.label}>Date Range</Text>
        <View style={styles.dateRangeContainer}>
          {dateRanges.map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.dateButton,
                dateRange === range && styles.dateButtonActive,
              ]}
              onPress={() => {
                setDateRange(range);
                if (range === 'Custom') {
                  setShowDatePicker(true);
                }
              }}
            >
              <Text
                style={[
                  styles.dateText,
                  dateRange === range && styles.dateTextActive,
                ]}
              >
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Include Options */}
        <View style={styles.optionsContainer}>
          <View style={styles.optionRow}>
            <Text style={styles.optionText}>Include Photos</Text>
            <Switch
              value={includePhotos}
              onValueChange={setIncludePhotos}
              trackColor={{ false: '#E0E0E0', true: '#81C784' }}
              thumbColor={includePhotos ? '#4CAF50' : '#f4f3f4'}
            />
          </View>
          <View style={styles.optionRow}>
            <Text style={styles.optionText}>Include Statistics</Text>
            <Switch
              value={includeStats}
              onValueChange={setIncludeStats}
              trackColor={{ false: '#E0E0E0', true: '#81C784' }}
              thumbColor={includeStats ? '#4CAF50' : '#f4f3f4'}
            />
          </View>
          <View style={styles.optionRow}>
            <Text style={styles.optionText}>Include Route Maps</Text>
            <Switch
              value={includeRoutes}
              onValueChange={setIncludeRoutes}
              trackColor={{ false: '#E0E0E0', true: '#81C784' }}
              thumbColor={includeRoutes ? '#4CAF50' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Export Button */}
        <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
          <Ionicons name="download-outline" size={24} color="#fff" />
          <Text style={styles.exportButtonText}>Export Data</Text>
        </TouchableOpacity>
      </View>

      {/* Report Templates */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>REPORT TEMPLATES</Text>
        {reportTemplates.map((template) => (
          <TouchableOpacity
            key={template.id}
            style={styles.templateCard}
            onPress={() => handleTemplateSelect(template)}
          >
            <View style={styles.templateIcon}>
              {template.icon === 'horse' ? (
                <MaterialCommunityIcons name="horse" size={24} color="#81C784" />
              ) : (
                <Ionicons name={template.icon as any} size={24} color="#81C784" />
              )}
            </View>
            <View style={styles.templateInfo}>
              <Text style={styles.templateName}>{template.name}</Text>
              <Text style={styles.templateDescription}>{template.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Exports */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>RECENT EXPORTS</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        {recentExports.map((item) => (
          <View key={item.id} style={styles.exportItem}>
            <View style={styles.fileIcon}>
              {item.type === 'PDF' && (
                <Ionicons name="document-text" size={24} color="#E74C3C" />
              )}
              {item.type === 'CSV' && (
                <Ionicons name="grid" size={24} color="#3498DB" />
              )}
              {item.type === 'Excel' && (
                <Ionicons name="grid" size={24} color="#27AE60" />
              )}
            </View>
            <View style={styles.fileInfo}>
              <Text style={styles.fileName}>{item.name}</Text>
              <Text style={styles.fileDetails}>
                {item.date} • {item.size}
              </Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="share-outline" size={24} color="#81C784" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Storage Info */}
      <View style={styles.storageCard}>
        <Text style={styles.storageTitle}>STORAGE USAGE</Text>
        <View style={styles.storageBar}>
          <View style={styles.storageFill} />
        </View>
        <Text style={styles.storageText}>24.5 MB of 100 MB used</Text>
        <TouchableOpacity style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear Old Exports</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  viewAll: {
    fontSize: 14,
    color: '#81C784',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    fontWeight: '600',
  },
  formatContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  formatButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 10,
    marginBottom: 10,
  },
  formatButtonActive: {
    backgroundColor: '#81C784',
  },
  formatText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  formatTextActive: {
    color: '#fff',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  dateButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
    marginBottom: 8,
  },
  dateButtonActive: {
    backgroundColor: '#81C784',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  dateTextActive: {
    color: '#fff',
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  exportButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  templateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    marginBottom: 10,
  },
  templateIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 12,
    color: '#666',
  },
  exportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  fileDetails: {
    fontSize: 12,
    color: '#999',
  },
  storageCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  storageTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  storageBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 10,
  },
  storageFill: {
    width: '24.5%',
    height: '100%',
    backgroundColor: '#81C784',
    borderRadius: 4,
  },
  storageText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  clearButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E74C3C',
    borderRadius: 8,
    alignSelf: 'center',
  },
  clearButtonText: {
    color: '#E74C3C',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ExportDataScreen;