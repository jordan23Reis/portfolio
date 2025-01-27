import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Platform } from '@angular/cdk/platform';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'portfolio';
  platform = inject(Platform);
  isMobile = this.platform.ANDROID || this.platform.IOS;

  currentIndex = 0;

  nextSlide() {
    if (this.currentIndex < this.items.length - 1) {
      this.currentIndex++;
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }

  currentDisplay: number = 1;
  isScrolling: boolean = false;
  scrollDelay: number = 1500;
  touchStartY: number = 0;
  touchStartX: number = 0;

  @HostListener('window:wheel', ['$event'])
  onScroll(event: WheelEvent) {
    if (!this.isScrolling) {
      this.isScrolling = true;

      if (event.deltaY > 0) {
        this.nextDisplay();
      } else {
        this.prevDisplay();
      }
      setTimeout(() => {
        this.isScrolling = false;
      }, this.scrollDelay);
    }
  }

  @HostListener('window:touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  @HostListener('window:touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
    const deltaX = this.touchStartX - touchEndX;
    const deltaY = this.touchStartY - touchEndY;

    if (!this.isScrolling) {
      this.isScrolling = true;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 50) {
          this.nextDisplay();
        } else if (deltaX < -50) {
          this.prevDisplay();
        }
      } else {
        if (deltaY > 50) {
          this.nextDisplay();
        } else if (deltaY < -50) {
          this.prevDisplay();
        }
      }
      setTimeout(() => {
        this.isScrolling = false;
      }, this.scrollDelay);
    }
  }

  @HostListener('window:touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (window.scrollY === 0 && event.touches[0].clientY > this.touchStartY) {
      event.preventDefault();
    }
  }

  nextDisplay() {
    if (this.currentDisplay < 4) {
      this.currentDisplay++;
    }
  }

  prevDisplay() {
    // if (this.isBlock === true) return
    if (this.currentDisplay > 1) {
      if (this.currentDisplay === 4) {
        this.currentDisplay = 5;
        setTimeout(() => {
          this.currentDisplay = 3;
        }, 1500);
      } else {
        this.currentDisplay--;
      }
    }
  }

  goToDisplay(displayNumber: number) {
    this.currentDisplay = displayNumber;
  }

  text = '<Jordan Borges/>';
  displayedText = '';
  index = 0;

  ngOnInit() {
    this.type();
    this.sortItems();
  }

  type() {
    if (this.index < this.text.length) {
      this.displayedText += this.text.charAt(this.index);
      this.index++;
      setTimeout(() => this.type(), 100);
    }
  }

  triggerLink(linkId: string) {
    const link = document.getElementById(linkId) as HTMLAnchorElement;
    link.click();
  }

  items = [
    {
      src: 'assets/a (1).jpg',
      alt: 'Hidden Item 1',
      position: 'hidden',
    },
    {
      src: 'assets/a (2).jpg',
      alt: 'Hidden Item 2',
      position: 'hidden',
    },
    { src: 'assets/a (3).jpg', alt: 'Left Item', position: 'left' },
    { src: 'assets/a (4).jpg', alt: 'Center Item', position: 'center' },
    { src: 'assets/a (5).jpg', alt: 'Right Item', position: 'right' },
  ];

  handleClick(position: string) {
    const index = this.items.findIndex((item) => item.position === position);
    this.items.forEach((item, i) => {
      if (i === index) item.position = 'center';
      else if (i === (index + 1) % this.items.length) item.position = 'right';
      else if (i === (index - 1 + this.items.length) % this.items.length)
        item.position = 'left';
      else item.position = 'hidden';
    });
  }

  sortItems() {
    const priorityOrder = ['left', 'center', 'right', 'hidden'];
    this.items.sort((a, b) => {
      return (
        priorityOrder.indexOf(a.position) - priorityOrder.indexOf(b.position)
      );
    });
  }

  isOpenInfo: number = 1;
  isBlock: boolean = false;
  selectedItem: any = null;

  openInfo(item: any): void {
    if (this.isOpenInfo === 2) {
      this.closeInfo();
    }
    if (this.isBlock === true) return;
    this.selectedItem = item;
    this.isOpenInfo = 2;
    this.isBlock = true;
  }

  closeInfo(): void {
    if (this.isOpenInfo !== 2) return;
    this.isOpenInfo = 3;
    setTimeout(() => {
      this.isOpenInfo = 1;
      this.selectedItem = null;
      this.isBlock = false;
    }, 1500);
  }
}
