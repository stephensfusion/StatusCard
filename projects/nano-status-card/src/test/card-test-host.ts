import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { CardInfo, NanoStatusCard } from '../public-api';
import { NanoStatusCardHarness } from '../../testing/public-api';
import { SAMPLE_CARDS } from './samples';

/** Consumer host. The template is the usage example with conflict C-1 resolved to `cardInfoData`. */
@Component({
  selector: 'nano-card-test-host',
  imports: [NanoStatusCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div id="card-frame" [style.width.px]="frameWidth()">
      <nano-status-card [cardInfoData]="cards()"></nano-status-card>
    </div>
  `,
})
export class CardTestHost {
  readonly cards = signal<CardInfo[]>([]);
  readonly frameWidth = signal(1280);
}

/**
 * Usage-documentation host. The requirement snippet binds `[CardInfo]`, which is
 * not the input named in the Usage Input section. This host uses `[cardInfoData]`
 * so the example compiles against the public input. See API_CONTRACT.md C-1.
 */
@Component({
  selector: 'nano-usage-example-host',
  imports: [NanoStatusCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<nano-status-card [cardInfoData]="cardInfoData"></nano-status-card>`,
})
export class UsageExampleHost {
  cardInfoData: CardInfo[] = SAMPLE_CARDS;
}

export interface CardHostContext {
  fixture: ComponentFixture<CardTestHost>;
  host: CardTestHost;
  harness: NanoStatusCardHarness;
  frame: HTMLElement;
  hostEl: HTMLElement;
  settle: () => Promise<void>;
}

/** Renders `cards` inside a frame of `frameWidth` pixels and returns the harness. */
export async function renderCards(cards: CardInfo[], frameWidth = 1280): Promise<CardHostContext> {
  const fixture = TestBed.createComponent(CardTestHost);
  const host = fixture.componentInstance;
  host.cards.set(cards);
  host.frameWidth.set(frameWidth);
  const settle = async (): Promise<void> => {
    fixture.detectChanges();
    await fixture.whenStable();
  };
  await settle();
  const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(NanoStatusCardHarness);
  const frame = fixture.nativeElement.querySelector('#card-frame') as HTMLElement;
  const hostEl = fixture.nativeElement.querySelector('nano-status-card') as HTMLElement;
  return { fixture, host, harness, frame, hostEl, settle };
}
