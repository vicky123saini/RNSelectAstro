import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import Swiper from 'react-native-swiper'
import * as env from '../../env';
import MainStyles from '../Styles';

const HoroscopeView = (props) =>{
    const MyHoroscope = props.dataSource;
    return (
        
        <View>
            <View style={[{ backgroundColor: "#F5F5F5", paddingHorizontal: 30, paddingTop:20 }]}>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Text style={[MainStyles.text, { fontSize: 20, fontWeight: "700" }]}>{MyHoroscope.Name_En} Today</Text>
                  <Text style={[MainStyles.text, { fontSize: 12, color: "#484848" }]}>{MyHoroscope.Name_En} ({MyHoroscope.StartDate}-{MyHoroscope.EndDate})</Text>
                </View>
                <View style={{ flex: 1, alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                  <Image style={{ width: 80, height: 80 }} resizeMode="stretch" source={{ uri: `${env.DynamicAssetsBaseURL}${MyHoroscope.ImagePath}` }} />
                </View>
              </View>
            </View> 
              
            <Swiper 
            style={styles.wrapper} 
            showsButtons={true}
            nextButton = {<Text style={{color:"#ccc", fontSize:30, fontWeight:"bold"}}>{'>'}</Text>}
            prevButton = {<Text style={{color:"#ccc", fontSize:30, fontWeight:"bold"}}>{'<'}</Text>}
            >
              <View style={styles.slide}>
                      <View style={styles.slide_text}>
                        <Text style={[MainStyles.text, { fontSize: 12, marginTop: 20 }]}>{MyHoroscope.bot_response.total_score.split_response}</Text>
                      </View>
                      <View style={{ width:"100%", flexDirection: "row", justifyContent:"space-between"}}>
                        <View style={{ alignItems: "center", alignContent: "center", justifyContent: "center" }}>
                          <Text style={[MainStyles.text, { fontSize: 20, color: "#F34E81", fontWeight: "700" }]}>{MyHoroscope.total_score}%</Text>
                          <Text style={[MainStyles.text, { fontSize: 12, color: "#090320" }]}>Luck Score</Text>
                        </View>
                        <View style={{ alignItems: "center", alignContent: "center", justifyContent: "center" }}>
                          <Text style={[MainStyles.text, { fontSize: 20, color: "#F34E81", fontWeight: "700" }]}>{MyHoroscope.lucky_number.toString()}</Text>
                          <Text style={[MainStyles.text, { fontSize: 12, color: "#090320" }]}>Lucky Number</Text>
                        </View>
                        <View style={{ alignItems: "center", alignContent: "center", justifyContent: "center" }}>
                          <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: MyHoroscope.lucky_color_code }}></View>
                          <Text style={[MainStyles.text, { fontSize: 12, color: "#090320" }]}>Lucky Colour</Text>
                        </View>
                      </View>
                    
                  </View>

                  <View style={styles.slide}>
                     
                  <View style={styles.slide_text}>
                        <Text style={[MainStyles.text, { fontSize: 16, fontWeight: "700", color: "#090320", marginBottom: 10 }]}>Physique</Text>
                        <Text style={[MainStyles.text, { fontSize: 12, color: "#090320" }]}>{MyHoroscope.bot_response.physique.split_response}</Text>
                        </View>
                        <View style={{ alignContent: "center" }}>
                          <Text style={[MainStyles.text, { fontSize: 20, color: "#F34E81", fontWeight: "700" }]}>{MyHoroscope.bot_response.physique.score}%</Text>
                          <Text style={[MainStyles.text, { fontSize: 12, color: "#090320" }]}>Score</Text>
                        </View>
                     
                     
                  </View>

                  <View style={styles.slide}>
                     
                  <View style={styles.slide_text}>
                        <Text style={[MainStyles.text, { fontSize: 16, fontWeight: "700", color: "#090320", marginBottom: 10 }]}>Status</Text>
                        <Text style={[MainStyles.text, { fontSize: 12, color: "#090320" }]}>{MyHoroscope.bot_response.status.split_response}</Text>
                        </View>
                        <View style={{ alignContent: "center" }}>
                          <Text style={[MainStyles.text, { fontSize: 20, color: "#F34E81", fontWeight: "700" }]}>{MyHoroscope.bot_response.status.score}%</Text>
                          <Text style={[MainStyles.text, { fontSize: 12, color: "#090320" }]}>Score</Text>
                        </View>
                     
                    
                  </View>
                  <View style={styles.slide}>
                     
                  <View style={styles.slide_text}>
                        <Text style={[MainStyles.text, { fontSize: 16, fontWeight: "700", color: "#090320", marginBottom: 10 }]}>Finances</Text>
                        <Text style={[MainStyles.text, { fontSize: 12, color: "#090320" }]}>{MyHoroscope.bot_response.finances.split_response}</Text>
                        </View>
                        <View style={{ alignContent: "center" }}>
                          <Text style={[MainStyles.text, { fontSize: 20, color: "#F34E81", fontWeight: "700" }]}>{MyHoroscope.bot_response.finances.score}%</Text>
                          <Text style={[MainStyles.text, { fontSize: 12, color: "#090320" }]}>Score</Text>
                        </View>
                     
                    
                  </View>

                  <View style={styles.slide}>
                    
                  <View style={styles.slide_text}>
                        <Text style={[MainStyles.text, { fontSize: 16, fontWeight: "700", color: "#090320", marginBottom: 10 }]}>Relationship</Text>
                        <Text style={[MainStyles.text, { fontSize: 12, color: "#090320" }]}>{MyHoroscope.bot_response.relationship.split_response}</Text>
                        </View>
                        <View style={{ alignContent: "center" }}>
                          <Text style={[MainStyles.text, { fontSize: 20, color: "#F34E81", fontWeight: "700" }]}>{MyHoroscope.bot_response.relationship.score}%</Text>
                          <Text style={[MainStyles.text, { fontSize: 12, color: "#090320" }]}>Score</Text>
                        </View>
                      
                    
                  </View>
                  <View style={styles.slide}>
                     
                  <View style={styles.slide_text}>
                        <Text style={[MainStyles.text, { fontSize: 16, fontWeight: "700", color: "#090320", marginBottom: 10 }]}>Career</Text>
                        <Text style={[MainStyles.text, { fontSize: 12, color: "#090320" }]}>{MyHoroscope.bot_response.career.split_response}</Text>
                        </View>
                        <View style={{ alignContent: "center" }}>
                          <Text style={[MainStyles.text, { fontSize: 20, color: "#F34E81", fontWeight: "700" }]}>{MyHoroscope.bot_response.career.score}%</Text>
                          <Text style={[MainStyles.text, { fontSize: 12, color: "#090320" }]}>Score</Text>
                        </View>
                      
                     
                  </View>
                  <View style={styles.slide}>
                   
                  <View style={styles.slide_text}>
                        <Text style={[MainStyles.text, { fontSize: 16, fontWeight: "700", color: "#090320", marginBottom: 10 }]}>Travel</Text>
                        <Text style={[MainStyles.text, { fontSize: 12, color: "#090320" }]}>{MyHoroscope.bot_response.travel.split_response}</Text>
                        </View>
                        <View style={{ alignContent: "center" }}>
                          <Text style={[MainStyles.text, { fontSize: 20, color: "#F34E81", fontWeight: "700" }]}>{MyHoroscope.bot_response.travel.score}%</Text>
                          <Text style={[MainStyles.text, { fontSize: 12, color: "#090320" }]}>Score</Text>
                        </View>
                    
                    
                  </View>
                  <View style={styles.slide}>
                    
                  <View style={styles.slide_text}>
                        <Text style={[MainStyles.text, { fontSize: 16, fontWeight: "700", color: "#090320", marginBottom: 10 }]}>Family</Text>
                        <Text style={[MainStyles.text, { fontSize: 12, color: "#090320" }]}>{MyHoroscope.bot_response.family.split_response}</Text>
                        </View>
                        <View style={{ alignContent: "center" }}>
                          <Text style={[MainStyles.text, { fontSize: 20, color: "#F34E81", fontWeight: "700" }]}>{MyHoroscope.bot_response.family.score}%</Text>
                          <Text style={[MainStyles.text, { fontSize: 12, color: "#090320" }]}>Score</Text>
                        </View>
                     
                    
                  </View>
                  <View style={styles.slide}>
                    
                  <View style={styles.slide_text}>
                        <Text style={[MainStyles.text, { fontSize: 16, fontWeight: "700", color: "#090320", marginBottom: 10 }]}>Friends</Text>
                        <Text style={[MainStyles.text, { fontSize: 12, color: "#090320" }]}>{MyHoroscope.bot_response.friends.split_response}</Text>
                        </View>
                        <View style={{ alignContent: "center" }}>
                          <Text style={[MainStyles.text, { fontSize: 20, color: "#F34E81", fontWeight: "700" }]}>{MyHoroscope.bot_response.friends.score}%</Text>
                          <Text style={[MainStyles.text, { fontSize: 12, color: "#090320" }]}>Score</Text>
                        </View>
                   
                  
                  </View>
                  <View style={styles.slide}>
                     
                  <View style={styles.slide_text}>
                        <Text style={[MainStyles.text, { fontSize: 16, fontWeight: "700", color: "#090320", marginBottom: 10 }]}>Health</Text>
                        <Text style={[MainStyles.text, { fontSize: 12, color: "#090320" }]}>{MyHoroscope.bot_response.health.split_response}</Text>
                        </View>
                        <View style={{ alignContent: "center" }}>
                          <Text style={[MainStyles.text, { fontSize: 20, color: "#F34E81", fontWeight: "700" }]}>{MyHoroscope.bot_response.health.score}%</Text>
                          <Text style={[MainStyles.text, { fontSize: 12, color: "#090320" }]}>Score</Text>
                        </View>
                   
                     
                  </View>
               

              </Swiper>


        </View>

           

        
      )
}

const styles = StyleSheet.create({
    wrapper: {height:220},
    slide: {
      flex: 1,
      backgroundColor: '#F5F5F5',
      paddingHorizontal: 30,
      paddingVertical:20
    },
    slide_text:{width:"100%", height:100}
    });

export default HoroscopeView;