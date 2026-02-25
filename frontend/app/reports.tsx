import React, { useEffect, useState } from "react";
import { View, Text, Button, TextInput , Alert, StyleSheet, ImageBackground} from "react-native";
import { createReport, getReports, reportResponse } from "../services/reports"





type reportFormProps = {
  userId: string;     
  listingId?: string;  
  targetName: string;  
};

export default function ReportForm({
  userId,
  listingId = "",
  targetName,
}: reportFormProps) {
  
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");


  const handleSubmit = async () => {
    if (!reason.trim()) {
      Alert.alert("Error", "Please enter a reason.");
      return;
    }

    try {
      
      const description = reason + (details ? ` - ${details}` : "");

      
      await createReport({
        user_id: userId,
        listing_id: listingId,
        description,
      });

      Alert.alert("Success", "Report submitted successfully.");

      
      setReason("");
      setDetails("");
    } catch (error) {
      console.log("Error submitting report:", error);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (


    
    <ImageBackground
    source={require("../assets/images/test01.jpg")}
    style={styles.container}
    resizeMode="cover"
    >
    <View style={styles.card}>
    {/*making the card*/}


      <Text style={styles.fields}>Reporting: {targetName}</Text>
      <Text style={styles.reportee}>{listingId ? "Type: LISTING" : "Type: USER"}</Text>

      
      <Text style={styles.fields}>Reason (required)</Text>
      <TextInput style={styles.input}
        placeholder="Enter reason"
        value={reason}
        onChangeText={setReason}
      />

      
      <Text style={styles.fields}>Additional Details (optional)</Text>
      <TextInput style={styles.input}
        placeholder="Provide more details..."
        value={details}
        onChangeText={setDetails}
        multiline
      />

      <View style={styles.submit_button}>
      <Button title="Submit Report" onPress={handleSubmit} />
      </View>

    </View>
    </ImageBackground>



   
  );
}




const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //borderRadius: 20,
    //padding: 40,
  },
  card: {
  width: "45%",
  backgroundColor: "rgba(255,255,255,0.9)",
  //backgroundColor: "#ffffff", 
  padding: 25,
  borderRadius: 12,
  shadowColor: "#0000FF",
  shadowOpacity: 0.1,
  shadowRadius: 10,
  shadowOffset: { width: 5, height: 4 },
  elevation: 5,
  }, 
  fields: {
    padding: 20,
    justifyContent: "flex-end",
    fontSize: 20,
  },
  input: {
    fontSize: 15,
    borderWidth: 1,
    padding: 30,
    borderRadius: 10,
  },
  submit_button : {
    marginTop:20,
    padding: 5,
    borderRadius: 10
  }, 
  reportee: {  fontSize: 15,
    borderWidth: 0,
    padding: 30,
    borderRadius: 10, 
   }

 
});