import {Component, OnInit} from '@angular/core';
import {employeeDataStore} from "../../data-stores/employee-data-store";
import {channelsDataStore} from "../../data-stores/channels-data-store";
import {MultimediaService} from "../../../services/multimedia.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ChatService} from "../../../services/chat.service";

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {

  employeeDataStore = employeeDataStore;
  channelsDataStore = channelsDataStore;
  chatsDataStore: any
  senderId = 3
  receiverId: any
  isOpen = false

  availableChats: any[] = [];

  constructor(private multimediaService: MultimediaService, private router: Router, private chatService: ChatService, private route: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.loadChats()
    // convert base64 images to safe urls
    // this.employeeDataStore.forEach(emp => {
    //   emp.photo = this.multimediaService.convertToSafeUrl(emp.photo, 'image/jpeg');
    // })
  }

  navigateUrl(id: any) {
    this.receiverId = id
    this.availableChats = [];
    this.router.navigate([`/feed/chat/${id}`]);
    this.loadChats()
  }

  loadChats() {
    this.chatService.getAllChats().subscribe(chats => {
      this.chatsDataStore = chats;

      employeeDataStore.forEach((emp) => {
        this.chatsDataStore.forEach((chats:any) => {
          if (chats.id == (this.senderId.toString()+emp.id.toString())) {
            let lastMessage = chats.messages.pop();
            this.availableChats.push({
              id: emp.id,
              photo: emp.photo,
              name: emp.name,
              chatId: chats.id,
              messageSenderId: lastMessage.userId,
              status: lastMessage.status,
              lastMessage: lastMessage.content,
              lastMessageId: lastMessage.id
            });
          }
          this.changeStatus(chats.id)
        })
      })
    });
  }

  changeStatus(id: any) {
    this.availableChats.forEach((chat) => {
      if (chat)
        this.isOpen = (chat.messageSenderId !== this.senderId.toString() && chat.status == 'sent');
    })
    this.setStatus(id)
  }

  setStatus(chatId: any) {
    this.availableChats.forEach((chat) => {
      if(this.receiverId == chat.id && chat.chatId == chatId) {
        this.chatService.updateStatus(chat.lastMessageId, 'read', chat.chatId).subscribe(data => {
          this.isOpen = false
        }, error => {
          console.log(error)
        })
      }
    })
  }
}
