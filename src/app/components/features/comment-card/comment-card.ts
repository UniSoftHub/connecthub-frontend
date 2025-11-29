import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IProjectCommentResponse } from '../../../interfaces/project-comment';
import { Textarea } from '../textarea/textarea';
import { PrimaryButton } from '../primary-button/primary-button';

@Component({
  selector: 'app-comment-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Textarea, PrimaryButton],
  templateUrl: './comment-card.html',
  styleUrls: ['./comment-card.scss'],
})
export class CommentCard implements OnInit {
  @Input({ required: true }) comment!: IProjectCommentResponse;
  @Input() currentUserId: number | null = null;

  @Output() like = new EventEmitter<number>();
  @Output() reply = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<{ id: number; text: string }>();

  isEditing = false;
  authorImageError = false;
  editForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      text: [
        this.comment.text,
        [Validators.required, Validators.minLength(1), Validators.maxLength(500)],
      ],
    });
  }

  get isOwner(): boolean {
    return this.currentUserId !== null && this.comment.author.id === this.currentUserId;
  }

  get author() {
    return this.comment.author;
  }

  getInitials(name: string): string {
    if (!name) return '??';

    const words = name
      .trim()
      .split(' ')
      .filter((word) => word.length > 0);

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }

  getAvatarColor(name: string): string {
    const colors = [
      '#9b7ed9',
      '#61dafb',
      '#dd0031',
      '#42b883',
      '#6db33f',
      '#3776ab',
      '#f7df1e',
      '#2496ed',
    ];

    if (!name) return colors[0];

    const hash = name.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    return colors[Math.abs(hash) % colors.length];
  }

  onAuthorImageError(): void {
    this.authorImageError = true;
  }

  onLike(): void {
    this.like.emit(this.comment.id);
  }

  onReply(): void {
    this.reply.emit(this.comment.id);
  }

  onEdit(): void {
    this.isEditing = true;
    this.editForm.patchValue({ text: this.comment.text });
  }

  onCancelEdit(): void {
    this.isEditing = false;
    this.editForm.patchValue({ text: this.comment.text });
  }

  onSaveEdit(): void {
    if (this.editForm.valid) {
      const newText = this.editForm.get('text')?.value?.trim();

      if (newText && newText !== this.comment.text) {
        this.edit.emit({
          id: this.comment.id,
          text: newText,
        });
      }
      this.isEditing = false;
    } else {
      console.log('Form inválido:', this.editForm.errors);
    }
  }

  onDelete(): void {
    if (confirm('Tem certeza que deseja excluir este comentário?')) {
      this.delete.emit(this.comment.id);
    }
  }
}
