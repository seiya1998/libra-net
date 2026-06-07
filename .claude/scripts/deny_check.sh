#!/bin/bash

# JSON 入力を読み取り、コマンドとツール名を抽出
input=$(cat)
command=$(echo "$input" | jq -r '.tool_input.command' 2>/dev/null || echo "")
tool_name=$(echo "$input" | jq -r '.tool_name' 2>/dev/null || echo "")

# Bash コマンドのみをチェック
if [ "$tool_name" != "Bash" ]; then
  exit 0
fi

# settings.json から拒否パターンを読み取り
# スクリプトの場所から相対的に settings.json を見つける
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
settings_file="$(dirname "$script_dir")/settings.json"

# Bash コマンドの全拒否パターンを取得
deny_patterns=$(jq -r '.permissions.deny[] | select(startswith("Bash(")) | gsub("^Bash\\("; "") | gsub("\\)$"; "")' "$settings_file" 2>/dev/null)

# コマンドが拒否パターンにマッチするかチェックする関数
matches_deny_pattern() {
  local cmd="$1"
  local pattern="$2"

  # 先頭・末尾の空白を削除
  cmd="${cmd#"${cmd%%[![:space:]]*}"}" # 先頭の空白を削除
  cmd="${cmd%"${cmd##*[![:space:]]}"}" # 末尾の空白を削除

  # コロンで終わるパターンの場合、コマンドの最初の単語とサブコマンドをチェック
  if [[ "$pattern" == *:* ]]; then
    # パターンからコロンと* を削除してプレフィックスを取得
    local prefix="${pattern%:*}"
    
    # プレフィックスがコマンドの先頭に一致するかチェック
    if [[ "$cmd" == "$prefix" ]] || [[ "$cmd" == "$prefix "* ]]; then
      # コマンドがプレフィックスのみの場合もマッチ
      if [[ "$cmd" == "$prefix" ]]; then
        return 0
      fi
      
      # プレフィックスの後の部分を取得
      local rest="${cmd#$prefix }"
      if [[ "$rest" != "$cmd" ]]; then
        # コロンの後のパターンを取得
        local suffix="${pattern#*:}"
        
        # suffix が * の場合はすべてマッチ
        if [[ "$suffix" == "*" ]]; then
          return 0
        fi
        
        # サブコマンドの最初の単語を取得
        local subcommand="${rest%% *}"
        # 特定のサブコマンドパターンとマッチ
        [[ "$subcommand" == $suffix ]]
        return $?
      fi
    fi
    return 1
  fi

  # glob パターンマッチング（ワイルドカード対応）
  [[ "$cmd" == $pattern ]]
}

# まずコマンド全体をチェック
while IFS= read -r pattern; do
  # 空行をスキップ
  [ -z "$pattern" ] && continue

  # コマンド全体がパターンにマッチするかチェック
  if matches_deny_pattern "$command" "$pattern"; then
    echo "Error: コマンドが拒否されました: '$command' (パターン: '$pattern')" >&2
    exit 2
  fi
done <<<"$deny_patterns"

# コマンドを論理演算子で分割し、各部分もチェック
# セミコロン、&& と || で分割（パイプ | と単一 & は分割しない）
temp_command="${command//;/$'\n'}"
temp_command="${temp_command//&&/$'\n'}"
temp_command="${temp_command//\|\|/$'\n'}"

IFS=$'\n'
for cmd_part in $temp_command; do
  # 空の部分をスキップ
  [ -z "$(echo "$cmd_part" | tr -d '[:space:]')" ] && continue

  # 各拒否パターンに対してチェック
  while IFS= read -r pattern; do
    # 空行をスキップ
    [ -z "$pattern" ] && continue

    # このコマンド部分がパターンにマッチするかチェック
    if matches_deny_pattern "$cmd_part" "$pattern"; then
      echo "Error: コマンドが拒否されました: '$cmd_part' (パターン: '$pattern')" >&2
      exit 2
    fi
  done <<<"$deny_patterns"
done

# カスタムルール: main / master ブランチへの git push を拒否
# settings.json の単純パターンでは引数解析できないため、ここで対応
for cmd_part in $temp_command; do
  # 空の部分をスキップ
  [ -z "$(echo "$cmd_part" | tr -d '[:space:]')" ] && continue

  # 先頭・末尾の空白を削除
  trimmed="${cmd_part#"${cmd_part%%[![:space:]]*}"}"
  trimmed="${trimmed%"${trimmed##*[![:space:]]}"}"

  # `git push` で始まるコマンドのみ対象
  if [[ "$trimmed" =~ ^git[[:space:]]+push([[:space:]]|$) ]]; then
    # 引数の中に main / master が単独・refspec として含まれているか判定
    # マッチパターン: "<sp|:>main(<sp>|<eol>|:)" / "<sp|:>master(<sp>|<eol>|:)"
    if [[ "$trimmed" =~ (^|[[:space:]:])(main|master)([[:space:]]|$|:) ]]; then
      echo "Error: main/master ブランチへの push は禁止されています: '$cmd_part'" >&2
      exit 2
    fi
  fi
done

# コマンドを許可
exit 0

