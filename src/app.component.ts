
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GeminiService } from './services/gemini.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule]
})
export class AppComponent {
  private readonly geminiService = inject(GeminiService);

  userDescription = signal('');
  generatedInstruction = signal<string | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);
  copied = signal(false);

  async generateInstruction(): Promise<void> {
    if (!this.userDescription().trim() || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    this.generatedInstruction.set(null);

    try {
      const instruction = await this.geminiService.generateSystemInstruction(this.userDescription());
      this.generatedInstruction.set(instruction);
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      this.isLoading.set(false);
    }
  }

  copyToClipboard(): void {
    if (!this.generatedInstruction()) {
      return;
    }
    navigator.clipboard.writeText(this.generatedInstruction() ?? '').then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      this.error.set('Failed to copy text to clipboard.');
    });
  }
}
