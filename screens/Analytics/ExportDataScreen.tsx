import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  Animated,
  Platform,
  Share,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { LinearGradient } from 'expo-linear-gradient';
import { analyticsService, exportHelpers, auth } from '../../services/firebase';

interface ExportRecord {
  id: string;
  name: string;
  date: string;
  size: string;
  type: string;
  url?: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconType: 'ionicon' | 'material' | 'fontawesome';
}

const ExportDataScreen = () => {
  const [selectedFormat, setSelectedFormat] = useState<'PDF' | 'CSV' | 'Excel' | 'JSON'>('PDF');
  const [includePhotos, setIncludePhotos] = useState(true);
  const [includeStats, setIncludeStats] = useState(true);
  const [includeRoutes, setIncludeRoutes] = useState(true);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());
  const [recentExports, setRecentExports] = useState<ExportRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  
  const fadeAnim = new Animated.Value(0);
  const progressAnim = new Animated.Value(0);

  const exportFormats = ['PDF', 'CSV', 'Excel', 'JSON'] as const;
  const dateRanges = ['Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'Last Year', 'Custom'];

  const reportTemplates: ReportTemplate[] = [
    {
      id: '1',
      name: 'Performance Summary',
      description: 'Overall riding performance and statistics',
      icon: 'analytics',
      iconType: 'ionicon',
    },
    {
      id: '2',
      name: 'Horse Usage Report',
      description: 'Detailed horse usage and performance metrics',
      icon: 'horse',
      iconType: 'material',
    },
    {
      id: '3',
      name: 'Trail Analysis',
      description: 'Trail popularity and route statistics',
      icon: 'map',
      iconType: 'ionicon',
    },
    {
      id: '4',
      name: 'Community Leaderboard',
      description: 'Top riders and community achievements',
      icon: 'trophy',
      iconType: 'fontawesome',
    },
    {
      id: '5',
      name: 'Monthly Progress',
      description: 'Monthly goals and achievement tracking',
      icon: 'calendar',
      iconType: 'ionicon',
    },
    {
      id: '6',
      name: 'Health & Safety Report',
      description: 'Horse health and safety compliance',
      icon: 'shield-checkmark',
      iconType: 'ionicon',
    },
  ];

  useEffect(() => {
    fetchExportHistory();
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchExportHistory = async () => {
    try {
      const userId = auth.currentUser?.uid || 'demo-user';
      const exports = await analyticsService.getExportHistory(userId, 5);
      setRecentExports(exports.map(exp => ({
        id: exp.id,
        name: exp.fileName,
        date: exp.createdAt?.toDate?.()?.toLocaleDateString() || new Date().toLocaleDateString(),
        size: exp.fileSize || '0 KB',
        type: exp.format,
        url: exp.downloadUrl,
      })));
    } catch (error) {
      console.error('Error fetching export history:', error);
    }
  };

  const animateProgress = (toValue: number) => {
    Animated.timing(progressAnim, {
      toValue,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const handleExport = async () => {
    Alert.alert(
      'Export Data',
      `Export your riding data as ${selectedFormat} for ${dateRange}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => processExport() },
      ]
    );
  };

  const processExport = async () => {
    try {
      setLoading(true);
      setExportProgress(0);
      animateProgress(0);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          const newProgress = Math.min(prev + 10, 90);
          animateProgress(newProgress / 100);
          return newProgress;
        });
      }, 200);

      // Fetch data based on date range
      const userId = auth.currentUser?.uid || 'demo-user';
      const timeRange = getTimeRangeFromSelection();
      const rides = await analyticsService.getRideStats(userId, timeRange);

      // Format data based on selected format
      let exportData: string = '';
      let fileName = `ride_data_${Date.now()}`;
      let mimeType = 'text/plain';

      switch (selectedFormat) {
        case 'CSV':
          exportData = exportHelpers.formatExportData(rides, 'csv') as string;
          fileName += '.csv';
          mimeType = 'text/csv';
          break;
        case 'JSON':
          exportData = exportHelpers.formatExportData(rides, 'json') as string;
          fileName += '.json';
          mimeType = 'application/json';
          break;
        case 'PDF':
          exportData = await generatePDFReport(rides);
          fileName += '.pdf';
          mimeType = 'application/pdf';
          break;
        case 'Excel':
          // Excel export would require additional library, using CSV as fallback
          exportData = exportHelpers.formatExportData(rides, 'csv') as string;
          fileName += '.xlsx';
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
      }

      clearInterval(progressInterval);
      setExportProgress(100);
      animateProgress(1);

      // Save to device and share
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, exportData);

      // Save export record to Firebase
      await analyticsService.saveExportRecord(userId, {
        fileName,
        format: selectedFormat,
        fileSize: `${(exportData.length / 1024).toFixed(2)} KB`,
        dateRange,
        includePhotos,
        includeStats,
        includeRoutes,
        includeCharts,
      });

      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Success', 'Data exported successfully!');
      }

      // Refresh export history
      fetchExportHistory();
      
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'Failed to export data. Please try again.');
    } finally {
      setLoading(false);
      setExportProgress(0);
      animateProgress(0);
    }
  };

  const generatePDFReport = async (rides: any[]) => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #4CAF50; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #4CAF50; color: white; }
            .summary { background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            .stat { display: inline-block; margin-right: 30px; }
            .stat-value { font-size: 24px; font-weight: bold; color: #333; }
            .stat-label { color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <h1>Riding Analytics Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          
          <div class="summary">
            <h2>Summary Statistics</h2>
            <div class="stat">
              <div class="stat-value">${rides.length}</div>
              <div class="stat-label">Total Rides</div>
            </div>
            <div class="stat">
              <div class="stat-value">${rides.reduce((sum, r) => sum + r.distance, 0).toFixed(1)} km</div>
              <div class="stat-label">Total Distance</div>
            </div>
            <div class="stat">
              <div class="stat-value">${rides.reduce((sum, r) => sum + r.duration, 0)} min</div>
              <div class="stat-label">Total Duration</div>
            </div>
          </div>
          
          <h2>Ride Details</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Horse</th>
                <th>Distance (km)</th>
                <th>Duration (min)</th>
              </tr>
            </thead>
            <tbody>
              ${rides.map(ride => `
                <tr>
                  <td>${ride.date?.toDate?.()?.toLocaleDateString() || 'N/A'}</td>
                  <td>${ride.horseName}</td>
                  <td>${ride.distance}</td>
                  <td>${ride.duration}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    const { uri } = await Print.printToFileAsync({ html });
    return uri;
  };

  const getTimeRangeFromSelection = (): 'daily' | 'weekly' | 'monthly' | 'yearly' => {
    switch (dateRange) {
      case 'Last 7 Days':
        return 'weekly';
      case 'Last 30 Days':
        return 'monthly';
      case 'Last Year':
        return 'yearly';
      default:
        return 'monthly';
    }
  };

  const handleTemplateSelect = (template: ReportTemplate) => {
    Alert.alert(
      template.name,
      `Generate ${template.name} report?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Generate', onPress: () => generateReport(template) },
      ]
    );
  };

  const generateReport = async (template: ReportTemplate) => {
    setLoading(true);
    try {
      // Generate specialized report based on template
      Alert.alert('Success', `${template.name} has been generated!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate report.');
    } finally {
      setLoading(false);
    }
  };

  const shareExport = async (exportItem: ExportRecord) => {
    try {
      if (exportItem.url) {
        await Share.share({
          message: `Check out my riding report: ${exportItem.name}`,
          url: exportItem.url,
        });
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const renderIcon = (template: ReportTemplate) => {
    const props = { size: 24, color: '#4CAF50' };
    
    switch (template.iconType) {
      case 'material':
        return <MaterialCommunityIcons name={template.icon as any} {...props} />;
      case 'fontawesome':
        return <FontAwesome5 name={template.icon as any} {...props} />;
      default:
        return <Ionicons name={template.icon as any} {...props} />;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={{ opacity: fadeAnim }}>
        {/* Header */}
        <LinearGradient
          colors={['#4CAF50', '#81C784']}
          style={styles.header}
        >
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Export Data</Text>
          <TouchableOpacity>
            <Ionicons name="help-circle-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>

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
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.dateRangeScroll}
          >
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
                      setShowStartDatePicker(true);
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
          </ScrollView>

          {/* Custom Date Pickers */}
          {dateRange === 'Custom' && (
            <View style={styles.customDateContainer}>
              <TouchableOpacity 
                style={styles.customDateButton}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Ionicons name="calendar" size={20} color="#666" />
                <Text style={styles.customDateText}>
                  From: {startDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.customDateButton}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Ionicons name="calendar" size={20} color="#666" />
                <Text style={styles.customDateText}>
                  To: {endDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowStartDatePicker(false);
                if (date) setStartDate(date);
              }}
            />
          )}

          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowEndDatePicker(false);
                if (date) setEndDate(date);
              }}
            />
          )}

          {/* Include Options */}
          <View style={styles.optionsContainer}>
            <View style={styles.optionRow}>
              <View style={styles.optionLeft}>
                <Ionicons name="image" size={20} color="#666" />
                <Text style={styles.optionText}>Include Photos</Text>
              </View>
              <Switch
                value={includePhotos}
                onValueChange={setIncludePhotos}
                trackColor={{ false: '#E0E0E0', true: '#81C784' }}
                thumbColor={includePhotos ? '#4CAF50' : '#f4f3f4'}
              />
            </View>
            <View style={styles.optionRow}>
              <View style={styles.optionLeft}>
                <Ionicons name="stats-chart" size={20} color="#666" />
                <Text style={styles.optionText}>Include Statistics</Text>
              </View>
              <Switch
                value={includeStats}
                onValueChange={setIncludeStats}
                trackColor={{ false: '#E0E0E0', true: '#81C784' }}
                thumbColor={includeStats ? '#4CAF50' : '#f4f3f4'}
              />
            </View>
            <View style={styles.optionRow}>
              <View style={styles.optionLeft}>
                <Ionicons name="map" size={20} color="#666" />
                <Text style={styles.optionText}>Include Route Maps</Text>
              </View>
              <Switch
                value={includeRoutes}
                onValueChange={setIncludeRoutes}
                trackColor={{ false: '#E0E0E0', true: '#81C784' }}
                thumbColor={includeRoutes ? '#4CAF50' : '#f4f3f4'}
              />
            </View>
            <View style={styles.optionRow}>
              <View style={styles.optionLeft}>
                <Ionicons name="bar-chart" size={20} color="#666" />
                <Text style={styles.optionText}>Include Charts</Text>
              </View>
              <Switch
                value={includeCharts}
                onValueChange={setIncludeCharts}
                trackColor={{ false: '#E0E0E0', true: '#81C784' }}
                thumbColor={includeCharts ? '#4CAF50' : '#f4f3f4'}
              />
            </View>
          </View>

          {/* Export Progress */}
          {loading && (
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>Exporting... {exportProgress}%</Text>
              <View style={styles.progressBarContainer}>
                <Animated.View
                  style={[
                    styles.progressBarFill,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              </View>
            </View>
          )}

          {/* Export Button */}
          <TouchableOpacity 
            style={[styles.exportButton, loading && styles.exportButtonDisabled]} 
            onPress={handleExport}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="download-outline" size={24} color="#fff" />
                <Text style={styles.exportButtonText}>Export Data</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Report Templates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>REPORT TEMPLATES</Text>
          <View style={styles.templatesGrid}>
            {reportTemplates.map((template) => (
              <TouchableOpacity
                key={template.id}
                style={styles.templateCard}
                onPress={() => handleTemplateSelect(template)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#E8F5E9', '#C8E6C9']}
                  style={styles.templateGradient}
                >
                  <View style={styles.templateIcon}>
                    {renderIcon(template)}
                  </View>
                  <Text style={styles.templateName}>{template.name}</Text>
                  <Text style={styles.templateDescription}>{template.description}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Exports */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>RECENT EXPORTS</Text>
            <TouchableOpacity onPress={fetchExportHistory}>
              <Text style={styles.viewAll}>Refresh</Text>
            </TouchableOpacity>
          </View>
          {recentExports.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={48} color="#E0E0E0" />
              <Text style={styles.emptyText}>No recent exports</Text>
            </View>
          ) : (
            recentExports.map((item) => {
              return (
                <React.Fragment key={`export-${item.id}`}>
                  <View style={styles.exportItem}>
                    <View style={styles.fileIcon}>
                      {item.type === 'PDF' && (
                        <Ionicons name="document-text" size={24} color="#E74C3C" />
                      )}
                      {item.type === 'CSV' && (
                        <FontAwesome5 name="file-csv" size={24} color="#3498DB" />
                      )}
                      {item.type === 'Excel' && (
                        <FontAwesome5 name="file-excel" size={24} color="#27AE60" />
                      )}
                      {item.type === 'JSON' && (
                        <Ionicons name="code-slash" size={24} color="#9B59B6" />
                      )}
                    </View>
                    <View style={styles.fileInfo}>
                      <Text style={styles.fileName} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.fileDetails}>
                        {item.date} • {item.size}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => shareExport(item)}>
                      <Ionicons name="share-outline" size={24} color="#4CAF50" />
                    </TouchableOpacity>
                  </View>
                </React.Fragment>
              );
            })
          )}
        </View>

        {/* Storage Info */}
        <View style={styles.storageCard}>
          <Text style={styles.storageTitle}>STORAGE USAGE</Text>
          <View style={styles.storageInfo}>
            <View style={styles.storageBar}>
              <View style={styles.storageFill} />
            </View>
            <Text style={styles.storageText}>24.5 MB of 100 MB used</Text>
          </View>
          
          <View style={styles.storageBreakdown}>
            <View style={styles.storageItem}>
              <View style={[styles.storageIndicator, { backgroundColor: '#E74C3C' }]} />
              <Text style={styles.storageLabel}>PDF Reports</Text>
              <Text style={styles.storageValue}>12.3 MB</Text>
            </View>
            <View style={styles.storageItem}>
              <View style={[styles.storageIndicator, { backgroundColor: '#3498DB' }]} />
              <Text style={styles.storageLabel}>CSV Files</Text>
              <Text style={styles.storageValue}>5.8 MB</Text>
            </View>
            <View style={styles.storageItem}>
              <View style={[styles.storageIndicator, { backgroundColor: '#27AE60' }]} />
              <Text style={styles.storageLabel}>Excel Files</Text>
              <Text style={styles.storageValue}>4.2 MB</Text>
            </View>
            <View style={styles.storageItem}>
              <View style={[styles.storageIndicator, { backgroundColor: '#9B59B6' }]} />
              <Text style={styles.storageLabel}>JSON Data</Text>
              <Text style={styles.storageValue}>2.2 MB</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.clearButton}>
            <Ionicons name="trash-outline" size={20} color="#E74C3C" />
            <Text style={styles.clearButtonText}>Clear Old Exports</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton}>
            <LinearGradient
              colors={['#4CAF50', '#81C784']}
              style={styles.quickActionGradient}
            >
              <Ionicons name="mail-outline" size={24} color="#fff" />
              <Text style={styles.quickActionText}>Email Report</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <LinearGradient
              colors={['#2196F3', '#64B5F6']}
              style={styles.quickActionGradient}
            >
              <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
              <Text style={styles.quickActionText}>Cloud Backup</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <LinearGradient
              colors={['#FF9800', '#FFB74D']}
              style={styles.quickActionGradient}
            >
              <Ionicons name="time-outline" size={24} color="#fff" />
              <Text style={styles.quickActionText}>Schedule Export</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
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
    paddingBottom: 25,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 20,
    marginHorizontal: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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
    letterSpacing: 0.5,
    marginBottom: 15,
  },
  viewAll: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
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
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#F0F0F0',
    marginRight: 10,
    marginBottom: 10,
  },
  formatButtonActive: {
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  formatText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  formatTextActive: {
    color: '#fff',
  },
  dateRangeScroll: {
    marginBottom: 15,
  },
  dateRangeContainer: {
    flexDirection: 'row',
  },
  dateButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
  },
  dateButtonActive: {
    backgroundColor: '#4CAF50',
  },
  dateText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  dateTextActive: {
    color: '#fff',
  },
  customDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  customDateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  customDateText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  progressContainer: {
    marginVertical: 15,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  exportButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  exportButtonDisabled: {
    opacity: 0.7,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  templateCard: {
    width: '50%',
    padding: 5,
  },
  templateGradient: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  templateIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  templateName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  templateDescription: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 14,
    color: '#999',
  },
  exportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  fileIcon: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  fileDetails: {
    fontSize: 12,
    color: '#999',
  },
  storageCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  storageTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  storageInfo: {
    marginBottom: 20,
  },
  storageBar: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
  storageFill: {
    width: '24.5%',
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  storageText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  storageBreakdown: {
    marginBottom: 20,
  },
  storageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  storageIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  storageLabel: {
    flex: 1,
    fontSize: 13,
    color: '#666',
  },
  storageValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E74C3C',
    borderRadius: 10,
    alignSelf: 'center',
  },
  clearButtonText: {
    color: '#E74C3C',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  quickActionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  quickActionGradient: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  quickActionText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 5,
  },
});

export default ExportDataScreen;