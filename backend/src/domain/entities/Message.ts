
export interface IMessage {
  _id?: string;
  chatId: string;        
  senderId: string;      
  receiverId: string;    
  text: string;          
  timestamp?: Date;     
}
