#!/usr/bin/env python3
"""
Gerador de documentos de User Stories (US) a partir dos documentos de Features.

Objetivo
--------
Criar automaticamente 1 arquivo .md por User Story nas pastas:
- epicos/features/user-stories/frontend
- epicos/features/user-stories/backend

O script lê os arquivos de feature (ex.: epicos/features/EP-02-F2.1_CRUD_Eventos_v1.01.md),
identifica blocos de US (US-FE-XX e US-BE-XX) e cria os documentos faltantes.

Uso
---
python epicos/features/user-stories/scripts/generate_user_stories.py --dry-run
python epicos/features/user-stories/scripts/generate_user_stories.py

Opções
------
--features-dir: diretório onde ficam os .md das features (default: epicos/features)
--out-dir: diretório base de saída (default: epicos/features/user-stories)
--dry-run: não escreve arquivos, apenas exibe o que faria
--overwrite: sobrescreve arquivos existentes
--verbose: logs detalhados
"""

from __future__ import annotations

import argparse
import re
import sys
import unicodedata
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List, Optional, Tuple


if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")


FEATURE_FILE_RE = re.compile(r"^(EP-\d{2}-F\d+\.\d+)_.*\.md$", re.IGNORECASE)

# Captura "US-FE-01 – Título" em heading ou linha normal.
US_LINE_RE = re.compile(
    r"""^
    (?:
        \#{2,6}\s+                # heading markdown (####)
      | \*\*                      # bold markdown (**US-..**)
    )?
    \s*
    US-(FE|BE)-(\d{1,2})          # tipo e número
    (?:\*\*)?                     # fecha bold se existir
    \s*
    [–-]\s*                       # separador (– ou -)
    (.+?)                         # título
    \s*$
    """,
    re.VERBOSE,
)

# Caso o documento use "**US-FE-01** - Título" (sem heading), pega também.
US_BOLD_RE = re.compile(
    r"^\*\*US-(FE|BE)-(\d{1,2})\*\*\s*[–-]\s*(.+?)\s*$"
)

# Feature ID no corpo do documento (quando presente)
FEATURE_ID_IN_BODY_RE = re.compile(r"\*\*ID da Feature\*\*\s*\|\s*(EP-\d{2}-F\d+\.\d+)")


@dataclass(frozen=True)
class UserStoryBlock:
    us_type: str  # FE ou BE
    us_number: str  # "01"
    title: str
    start_line_idx: int  # inclusive
    end_line_idx: int  # exclusive


def iter_feature_files(features_dir: Path) -> Iterable[Path]:
    for p in sorted(features_dir.glob("EP-*-F*_*v*.md")):
        if p.is_file():
            yield p


def normalize_slug(text: str, max_len: int = 80) -> str:
    # Remove acentos e normaliza para ASCII
    nfkd = unicodedata.normalize("NFKD", text)
    ascii_text = "".join(ch for ch in nfkd if not unicodedata.combining(ch))

    # Remove caracteres problemáticos e troca por underscore
    ascii_text = re.sub(r"[^A-Za-z0-9]+", "_", ascii_text)
    ascii_text = re.sub(r"_+", "_", ascii_text).strip("_")

    if not ascii_text:
        ascii_text = "Sem_Titulo"

    return ascii_text[:max_len]


def detect_feature_id(feature_file: Path, text: str) -> Optional[str]:
    m = FEATURE_FILE_RE.match(feature_file.name)
    if m:
        return m.group(1)

    m2 = FEATURE_ID_IN_BODY_RE.search(text)
    if m2:
        return m2.group(1)

    return None


def find_us_markers(lines: List[str]) -> List[Tuple[int, str, str, str]]:
    """
    Retorna lista de marcadores: (idx_linha, tipo, numero_2d, titulo)
    """
    markers: List[Tuple[int, str, str, str]] = []
    for i, line in enumerate(lines):
        m = US_LINE_RE.match(line)
        if not m:
            m = US_BOLD_RE.match(line)
        if not m:
            continue
        us_type = m.group(1).upper()
        us_number = f"{int(m.group(2)):02d}"
        title = m.group(3).strip()
        markers.append((i, us_type, us_number, title))
    return markers


def extract_us_blocks(lines: List[str]) -> List[UserStoryBlock]:
    markers = find_us_markers(lines)
    if not markers:
        return []

    blocks: List[UserStoryBlock] = []
    for idx, (line_idx, us_type, us_number, title) in enumerate(markers):
        next_line_idx = markers[idx + 1][0] if idx + 1 < len(markers) else len(lines)
        blocks.append(
            UserStoryBlock(
                us_type=us_type,
                us_number=us_number,
                title=title,
                start_line_idx=line_idx,
                end_line_idx=next_line_idx,
            )
        )
    return blocks


def output_path(out_dir: Path, feature_id: str, block: UserStoryBlock) -> Path:
    subdir = "frontend" if block.us_type == "FE" else "backend"
    slug = normalize_slug(block.title)
    filename = f"{feature_id}-US-{block.us_type}-{block.us_number}_{slug}.md"
    return out_dir / subdir / filename


def already_exists_by_id(out_dir: Path, feature_id: str, block: UserStoryBlock) -> bool:
    """
    Considera existente se houver qualquer arquivo com o prefixo do ID da US,
    independente do slug do título.
    Ex.: EP-08-F8.1-US-FE-01_*.md
    """
    subdir = "frontend" if block.us_type == "FE" else "backend"
    pattern = f"{feature_id}-US-{block.us_type}-{block.us_number}_*.md"
    return any((out_dir / subdir).glob(pattern))


def build_doc(feature_file: Path, feature_id: str, block: UserStoryBlock, lines: List[str]) -> str:
    chunk = "\n".join(lines[block.start_line_idx : block.end_line_idx]).rstrip() + "\n"
    tipo = "Frontend" if block.us_type == "FE" else "Backend"
    title = block.title.strip()
    us_id = f"{feature_id}-US-{block.us_type}-{block.us_number}"
    rel_feature = feature_file.as_posix()

    header = (
        f"# {us_id} — {title}\n\n"
        f"**Tipo:** {tipo}  \n"
        f"**Feature:** {feature_id}  \n"
        f"**Fonte:** `{rel_feature}`  \n\n"
        f"---\n\n"
        f"## Conteúdo (extraído da Feature)\n\n"
    )
    return header + chunk


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Gera documentos de User Stories a partir dos documentos das Features."
    )
    parser.add_argument(
        "--features-dir",
        default=str(Path("epicos") / "features"),
        help="Diretório contendo os .md das features (default: epicos/features)",
    )
    parser.add_argument(
        "--out-dir",
        default=str(Path("epicos") / "features" / "user-stories"),
        help="Diretório base de saída (default: epicos/features/user-stories)",
    )
    parser.add_argument("--dry-run", action="store_true", help="Não escreve arquivos, apenas simula")
    parser.add_argument("--overwrite", action="store_true", help="Sobrescreve arquivos existentes")
    parser.add_argument("--verbose", action="store_true", help="Logs detalhados")

    args = parser.parse_args()

    features_dir = Path(args.features_dir).resolve()
    out_dir = Path(args.out_dir).resolve()
    out_front = out_dir / "frontend"
    out_back = out_dir / "backend"

    if not features_dir.exists():
        print(f"[ERRO] Diretório de features não encontrado: {features_dir}")
        return 1

    out_front.mkdir(parents=True, exist_ok=True)
    out_back.mkdir(parents=True, exist_ok=True)

    created = 0
    skipped = 0
    processed_files = 0
    blocks_found = 0

    for feature_file in iter_feature_files(features_dir):
        processed_files += 1
        text = feature_file.read_text(encoding="utf-8")
        feature_id = detect_feature_id(feature_file, text)
        if not feature_id:
            if args.verbose:
                print(f"[SKIP] Não foi possível detectar Feature ID: {feature_file.name}")
            continue

        lines = text.splitlines()
        blocks = extract_us_blocks(lines)
        if not blocks:
            if args.verbose:
                print(f"[SKIP] Nenhuma US encontrada em: {feature_file.name}")
            continue

        blocks_found += len(blocks)

        for block in blocks:
            target = output_path(out_dir, feature_id, block)
            if (target.exists() or already_exists_by_id(out_dir, feature_id, block)) and not args.overwrite:
                skipped += 1
                continue

            doc = build_doc(feature_file, feature_id, block, lines)

            if args.dry_run:
                if args.verbose:
                    print(f"[DRY-RUN] Criaria: {target}")
                created += 1
                continue

            target.write_text(doc, encoding="utf-8")
            created += 1
            if args.verbose:
                print(f"[OK] Criado: {target}")

    mode = "DRY-RUN" if args.dry_run else "PRODUÇÃO"
    print("\n" + "=" * 70)
    print(f"[RELATÓRIO] GERAÇÃO DE USER STORIES ({mode})")
    print("=" * 70)
    print(f"Features analisadas: {processed_files}")
    print(f"Blocos de US encontrados: {blocks_found}")
    print(f"Arquivos {'a criar' if args.dry_run else 'criados'}: {created}")
    print(f"Arquivos ignorados (já existiam): {skipped}")
    print("=" * 70)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())

