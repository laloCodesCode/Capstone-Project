#set page(margin: 1in)
#set page("a4")
#set text(size: 12pt)
#set par(justify: true, leading: 2em,)
#set par(first-line-indent: 2em)
#set page("a4", numbering: "1")
#set text(font: "STIX Two Text")








#align(center)[
  \
  \
  \
  \
  \
  \
  #heading(level: 1, outlined: false)[NomNom Bot]

  \
  Lily Nguyen (Leader)
  \
  Jared Martinez-Sanchez
  \
  Eduardo Herrera-Barraza
]








#pagebreak()
#outline()










#pagebreak()
= Project Definition

NomNom Bot is a cooking AI Bot directed to University students who are on their own for the first time and might have struggles with cooking. NomNom Bot’s goal is to make cooking easier for students. It gives students a resource to help create different foods and supply them with the needed ingredients and simple directions. Hopefully it will allow students to be able to cook homemade meals for themselves with ease more often.  NomNom Bot will be implemented with an AI chatbot giving a seamless and easy going feel when cooking. NomNom Bot will provide nutritious, filling meals that are perfect for students and provide the nutrition facts as well. NomNom Bot’s AI chatbot functionality will act as if you are texting a personal chef for directions and help. NomNom Bot will be built on the Laravel framework for backend, React Native for frontend, chat logs and information will be stored using a Postgres database. 








#pagebreak()
= Project Requirements Analysis

*Functionality: *

For the users, NomNom bot will be easy to use through a familiar chatbot interface. The user will type in food specific questions, and the chatbot will yield a recipe or associated information. The user is presented with a text like conversation interface. Seamless conversation style, keen to talking to a human chef but through your phone. It will have immediate responses to user questions. NomNom Bot is a mobile application that is built on the Laravel framework to handle backend interactions with a seamless and responsive frontend built using the React Native framework, and all chat specific information will be stored and managed through a PostgreSQL database. NomNom Bot security consists of user accounts with specific roles and login credentials according to general user or developer/admin user. NomNom Bot will have a content filter to make sure users do not submit NSFW images, text, and or other malicious code. 














#pagebreak()
= Project Specification

== Focus/Domain/Area:

The focus of our project is to target young adults in college that don't have   
experience in cooking.


== Libraries/ Frameworks/Development

=== Frontend Framework:
  - Expo(React Native and Typescript)
  - Navigation: Expo-Router
  - UI/Styling: Tailwind CSS

=== Backend Framework:
  - Laravel(PHP)

== Platform:
  - Mobile

== Genre:
  - Mobile AI Chatbot Application

== Data Resource:
  - OpenAI LLM







#pagebreak()


= System Design
#image("Capstone_Proposed SystemDesgin.drawio.png", width: 80% )
